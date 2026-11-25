'use client';
import type { Bi } from '@/config/wedding';
export const useL = () => (b: Bi) => b.en;
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
