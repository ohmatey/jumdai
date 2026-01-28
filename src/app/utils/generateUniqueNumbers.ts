/**
 * Generates an array of unique random numbers from 0 to max-1.
 * Uses Fisher-Yates shuffle approach for guaranteed uniqueness.
 *
 * @param length - Number of unique random numbers to generate
 * @param max - Upper bound (exclusive) for the random numbers
 * @returns Array of unique random numbers
 */
const generateUniqueRandomNumbers = (length: number, max: number): number[] => {
  if (length > max) {
    throw new Error(`Cannot generate ${length} unique numbers from range 0-${max - 1}`)
  }

  if (length <= 0 || max <= 0) {
    return []
  }

  // For small selections from a large pool, use Set-based approach
  if (length <= max / 2) {
    const uniqueNumbers = new Set<number>()
    while (uniqueNumbers.size < length) {
      const randomNum = Math.floor(Math.random() * max)
      uniqueNumbers.add(randomNum)
    }
    return Array.from(uniqueNumbers)
  }

  // For large selections, shuffle and take first n elements (Fisher-Yates)
  const pool = Array.from({ length: max }, (_, i) => i)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, length)
}

export default generateUniqueRandomNumbers
