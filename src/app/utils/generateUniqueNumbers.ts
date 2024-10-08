const generateUniqueRandomNumbers = (length: number, max: number): number[] => {
  // use array lenght to map
  const randomNumbers = [...Array(length)].map(() => Math.floor(Math.random() * max))

  // if (randomNumbersArray.length < length) {
  //   return generateUniqueRandomNumbers(length, max)
  // }

  return randomNumbers
}

export default generateUniqueRandomNumbers