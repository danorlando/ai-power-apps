import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any) {
  return twMerge(clsx(inputs));
}

export * from './Button';
export * from './Dialog';
export * from './Input';
export * from './Label';
export * from './Tabs';
export * from './Textarea';
export * from './DropdownMenu';
