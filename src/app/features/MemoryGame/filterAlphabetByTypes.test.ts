import thaiAlphabet from '@/app/utils/thaiAlphabet'
import { filterAlphabetByTypes } from './memoryGameStore'
import { ThaiAlphabetType } from '@/app/types.d'

describe('filterAlphabetByTypes', () => {
  test('should return an empty array if the input array is empty', () => {
    const result = filterAlphabetByTypes([], [])
    expect(result).toEqual([])
  })

  test('should return an empty array if the input array does not contain the types', () => {
    const result = filterAlphabetByTypes([...thaiAlphabet], [])
    expect(result).toEqual([])
  })

  test('should return the input array if the types array contains all types', () => {
    const result = filterAlphabetByTypes([...thaiAlphabet], Object.values(ThaiAlphabetType))
    expect(result).toEqual(thaiAlphabet)
  })

  test('should return the input array if the types array contains some types', () => {
    const types = [ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel]
    const filteredAlphabet = [...thaiAlphabet].filter((item) => {
      return types.includes(item.type)
    })

    const result = filterAlphabetByTypes([...thaiAlphabet], types)
    expect(result).toEqual(filteredAlphabet)
  })

  test('should return the same array if the types array contains the same type', () => {
    const types = [ThaiAlphabetType.Consonant]

    const shortAlphabet = thaiAlphabet.filter((item) => {
      return types.includes(item.type)
    })

  const result = filterAlphabetByTypes([...shortAlphabet], types)
    expect(result).toEqual(shortAlphabet)
    expect(result.length).toBeGreaterThan(0)
  })
})