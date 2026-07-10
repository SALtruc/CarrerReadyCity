import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
// encodeURI keeps path separators and filename ampersands compatible with Vite's public-file middleware.
export const asset = (path: string) => encodeURI(`/assets/${path}`);
