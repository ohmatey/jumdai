const generateUniqueRandomNumbers = (length: number, max: number): number[] => {
  const randomNumbers = new Set<number>()

  while (randomNumbers.size < length) {
    randomNumbers.add(Math.floor(Math.random() * max))
  }

  const randomNumbersArray = Array.from(randomNumbers)

  if (randomNumbersArray.length < length) {
    return generateUniqueRandomNumbers(length, max)
  }

  return randomNumbersArray
}

export default generateUniqueRandomNumbers