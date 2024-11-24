import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateAggregateValue = (
  values: number[],
  type: 'mean' | 'median'
): number => {
  if (type === 'mean') {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

export const getColorForScore = (score: number, max: number = 5): string => {
  const ratio = score / max;
  const red = Math.round(255 * (1 - ratio));
  const green = Math.round(255 * ratio);
  return `rgb(${red}, ${green}, 0)`;
};

export const debounceFunction = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};