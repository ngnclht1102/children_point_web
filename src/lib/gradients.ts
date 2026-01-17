/**
 * Gradient class utilities
 */

/**
 * Array of gradient classes
 */
export const GRADIENT_CLASSES = [
  'bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100',
  'bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100',
  'bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100',
  'bg-gradient-to-r from-emerald-100 via-green-100 to-lime-100',
  'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100',
] as const;

/**
 * Get random gradient class
 */
export function getRandomGradient(): string {
  return GRADIENT_CLASSES[
    Math.floor(Math.random() * GRADIENT_CLASSES.length)
  ] as string;
}

/**
 * Get gradient class by index (for consistent styling)
 */
export function getGradientByIndex(index: number): string {
  return GRADIENT_CLASSES[index % GRADIENT_CLASSES.length] as string;
}
