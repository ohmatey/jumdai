import { getCorrectAnswer } from './memoryGameStore'
import { Step, InputMode } from './types'
import { ThaiAlphabetType } from '@/app/types'
import thaiAlphabet from '@/app/utils/thaiAlphabet'
import { filterAlphabetByTypes } from './memoryGameStore'

describe('getCorrectAnswer', () => {
  test('should return correct answer', () => {
    const prompt = {
      alphabet: 'ก',
    }
    const currentStep: Step = {
      prompt,
      options: [
        {
          alphabet: 'ก',
        },
        {
          alphabet: 'ข',
        },
        {
          alphabet: 'ค',
        },
      ],
      points: 3,
      inputMode: InputMode.Options,
    }

    expect(getCorrectAnswer(currentStep)).toEqual(prompt)
  })

  test('should return undefined if prompt is not defined', () => {
    const currentStep: Step = {
      prompt: undefined,
      options: [
        {
          alphabet: 'ก',
        },
        {
          alphabet: 'ข',
        },
        {
          alphabet: 'ค',
        },
      ],
      points: 3,
      inputMode: InputMode.Options,
    }

    expect(getCorrectAnswer(currentStep)).toBeUndefined()
  })

  test('should return undefined if currentStep is not defined', () => {
    expect(getCorrectAnswer(undefined)).toBeUndefined()
  })

  test('should return correct answer for vowels', () => {
    const vowelsAlphabet = filterAlphabetByTypes(thaiAlphabet, [ThaiAlphabetType.Vowel])
    
    vowelsAlphabet.forEach((vowel) => {
      const prompt = {
        alphabet: vowel.alphabet,
      }
      const currentStep: Step = {
        prompt,
        options: [
          {
            alphabet: vowel.alphabet,
          },
          {
            alphabet: 'ข',
          },
          {
            alphabet: 'ค',
          },
        ],
        points: 3,
        inputMode: InputMode.Options,
      }

      expect(getCorrectAnswer(currentStep)).toEqual(prompt)
    })
  })
})