const PLACE_CODES = {
  theatre: "A",
  science: "I",
  business: "E",
  community: "S",
  maker: "R",
  records: "C"
};

const MAX_BODY_LENGTH = 20000;
const MAX_ANSWERS_PER_PLACE = 20;
const MAX_OPTION_LENGTH = 200;
const SID_PATTERN = /^S\d{7,9}$/;
const DEFAULT_ALLOWED_ORIGINS = [];

function isTruthyEnvFlag(value) {
  return typeof value === "string" && ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function json(res, status, body) {
  return res.status(status).json(body);
}

function getAllowedOrigins() {
  const configuredOrigins = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const vercelOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null;

  return [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...configuredOrigins,
    ...(vercelOrigin ? [vercelOrigin] : [])
  ];
}

function applyCors(req, res) {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  const allowsAnyOrigin = allowedOrigins.includes("*");

  if (requestOrigin && (allowsAnyOrigin || allowedOrigins.includes(requestOrigin))) {
    res.setHeader("Access-Control-Allow-Origin", allowsAnyOrigin ? "*" : requestOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

async function parseRequestBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  if (Buffer.isBuffer(req.body)) {
    return req.body.length > 0 ? JSON.parse(req.body.toString("utf8")) : {};
  }

  if (typeof req.body === "object") {
    return req.body;
  }

  return {};
}

function isValidSid(sid) {
  return SID_PATTERN.test(sid);
}

function clampText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function sanitizeAnswers(answers) {
  if (!answers || typeof answers !== "object") {
    return {};
  }

  const sanitized = {};

  for (const slug of Object.keys(PLACE_CODES)) {
    const options = answers[slug];

    if (!Array.isArray(options)) {
      continue;
    }

    sanitized[slug] = options
      .filter((option) => typeof option === "string" && option.trim())
      .slice(0, MAX_ANSWERS_PER_PLACE)
      .map((option) => clampText(option, MAX_OPTION_LENGTH));
  }

  return sanitized;
}

function computeScores(answers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const [slug, code] of Object.entries(PLACE_CODES)) {
    scores[code] += (answers[slug] || []).length;
  }

  return scores;
}

function rankHollandCode(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code]) => code)
    .join("");
}

async function appendResultRow(payload) {
  const response = await fetch(process.env.APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...payload,
      secret: process.env.APPS_SCRIPT_SECRET
    })
  });

  const rawText = await response.text();
  let result = {};

  try {
    result = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    result = {
      ok: false,
      error: "invalid_apps_script_response"
    };
  }

  return {
    ok: Boolean(response.ok && result.ok),
    error: result.error || null,
    status: response.status
  };
}

function getAppsScriptErrorMessage(errorCode, statusCode) {
  switch (errorCode) {
    case "unauthorized":
      return "Apps Script secret mismatch. Check APPS_SCRIPT_SECRET and INGEST_SECRET.";
    case "missing_sheet":
      return "Google Sheet tab 'Results' was not found.";
    case "invalid_apps_script_response":
      return "Apps Script returned an invalid response. Use the deployed /exec URL and set access to Anyone.";
    default:
      if (statusCode === 401 || statusCode === 403) {
        return "Apps Script access is blocked. Redeploy the web app with access set to Anyone.";
      }

      return "We couldn't save your result right now. Please try again.";
  }
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 405, {
      ok: false,
      error: "method_not_allowed",
      message: "Unsupported request method."
    });
  }

  if (isTruthyEnvFlag(process.env.BYPASS_RESULT_STORAGE)) {
    return json(res, 200, {
      ok: true,
      bypassed: true
    });
  }

  if (!process.env.APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SECRET) {
    return json(res, 500, {
      ok: false,
      error: "missing_apps_script_config",
      message: "Missing Google Apps Script configuration."
    });
  }

  try {
    const requestBody = await parseRequestBody(req);
    const serializedBody = JSON.stringify(requestBody);

    if (serializedBody.length > MAX_BODY_LENGTH) {
      return json(res, 413, {
        ok: false,
        error: "payload_too_large",
        message: "Submitted payload is too large."
      });
    }

    const sid = clampText(requestBody.sid, 12).toUpperCase();
    const honeypot = String(requestBody.website || "").trim();

    if (honeypot) {
      return json(res, 400, {
        ok: false,
        error: "bot_detected",
        message: "Bot submission rejected."
      });
    }

    if (!isValidSid(sid)) {
      return json(res, 400, {
        ok: false,
        error: "invalid_student_id",
        message: "Please enter a valid student number."
      });
    }

    const answers = sanitizeAnswers(requestBody.answers);
    const scores = computeScores(answers);

    const payload = {
      submittedAt: new Date().toISOString(),
      sid,
      year: clampText(requestBody.year, 40),
      program: clampText(requestBody.program, 80),
      accessCode: clampText(requestBody.accessCode, 40),
      avatar: Number.isInteger(requestBody.avatar) ? requestBody.avatar : -1,
      placesVisited: Object.keys(answers).length,
      hollandCode: rankHollandCode(scores),
      scoreRealistic: scores.R,
      scoreInvestigative: scores.I,
      scoreArtistic: scores.A,
      scoreSocial: scores.S,
      scoreEnterprising: scores.E,
      scoreConventional: scores.C
    };

    const appendResult = await appendResultRow(payload);

    if (!appendResult.ok) {
      return json(res, 502, {
        ok: false,
        error: appendResult.error || "apps_script_failed",
        message: getAppsScriptErrorMessage(appendResult.error, appendResult.status)
      });
    }

    return json(res, 200, {
      ok: true
    });
  } catch (error) {
    console.error("Result submission failed", error);

    return json(res, 500, {
      ok: false,
      error: "result_submission_failed",
      message: "We couldn't save your result right now. Please try again."
    });
  }
};
