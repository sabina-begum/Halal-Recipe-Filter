/**
 * Cryptographically strong random helpers (browser Web Crypto).
 * Prefer over Math.random() for tokens, shuffles, and unbiased picks.
 */

/** Uniform integer in [0, maxExclusive). Requires maxExclusive >= 1. */
export function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1) {
    throw new RangeError("randomInt: maxExclusive must be a positive integer");
  }
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % maxExclusive;
}

/** Fisher–Yates shuffle (copy). */
export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
