import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名のマージ
 * @param inputs クラス名の配列
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
