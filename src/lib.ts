import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
// encodeURI keeps path separators and filename ampersands compatible with Vite's public-file middleware.
export const asset = (path: string) => encodeURI(`/assets/${path}`);

// Runtime artwork is exported separately at its real display size. Keeping the
// original Figma PNGs in the repository is useful for future design work, but
// decoding those multi-megapixel files during an interaction is unnecessarily
// expensive on mobile.
export const optimizedAsset = (path: string) => {
  const webpPath = path.replace(/\.png$/i, '.webp');
  return asset(`optimized/${webpPath}`);
};

export function preloadAssets(paths: string[]) {
  if (typeof window === 'undefined') return () => undefined;
  let cancelled = false;
  const warm = () => {
    if (cancelled) return;
    paths.forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  };
  const browser = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: {timeout:number}) => number;
    cancelIdleCallback?: (id:number) => void;
  };
  const idleId = browser.requestIdleCallback?.(warm, {timeout: 900});
  const timeoutId = idleId === undefined ? window.setTimeout(warm, 120) : undefined;
  return () => {
    cancelled = true;
    if (idleId !== undefined) browser.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}
