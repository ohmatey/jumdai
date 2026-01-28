import { 
  parseGameSettingsFromSearchParams, 
  sanitizeUserInput, 
  getValidationErrorMessage 
} from '../validation.utils'
import { 
  GameType, 
  GameMode, 
  GameLevel, 
  LanguageMode, 
  InputMode 
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'
import { z } from 'zod'

describe('validation.utils', () => {
  describe('parseGameSettingsFromSearchParams', () => {
    it('should parse valid game settings from URL search params', () => {
      const params = new URLSearchParams({
        'level': 'easy',
        'mode': 'sequence',
        'type': 'alphabet',
        'language-mode': 'thai',
        'input-mode': 'options',
        'number-options': '3'
      })
      
      const result = parseGameSettingsFromSearchParams(params)
      
      expect(result).toEqual({
        gameLevel: GameLevel.Easy,
        gameMode: GameMode.Sequence,
        gameType: GameType.Alphabet,
        languageMode: LanguageMode.Thai,
        inputMode: InputMode.Options,
        numberOfOptions: 3,
        thaiAlphabetTypes: Object.values(ThaiAlphabetType)
      })
    })

    it('should handle multiple alphabet types', () => {
      const params = new URLSearchParams()
      params.append('alphabet-type', 'consonant')
      params.append('alphabet-type', 'vowel')
      
      const result = parseGameSettingsFromSearchParams(params)
      
      expect(result.thaiAlphabetTypes).toEqual([
        ThaiAlphabetType.Consonant,
        ThaiAlphabetType.Vowel
      ])
    })

    it('should use default values for invalid params', () => {
      const params = new URLSearchParams({
        'level': 'invalid',
        'mode': 'invalid',
        'number-options': 'abc'
      })
      
      const result = parseGameSettingsFromSearchParams(params)
      
      expect(result.gameLevel).toBe(GameLevel.Easy)
      expect(result.gameMode).toBe(GameMode.Sequence)
      expect(result.numberOfOptions).toBe(3)
    })

    it('should validate number of options within range', () => {
      const params1 = new URLSearchParams({ 'number-options': '10' })
      const result1 = parseGameSettingsFromSearchParams(params1)
      expect(result1.numberOfOptions).toBe(3) // Falls back to default for invalid values

      const params2 = new URLSearchParams({ 'number-options': '1' })
      const result2 = parseGameSettingsFromSearchParams(params2)
      expect(result2.numberOfOptions).toBe(3) // Falls back to default for invalid values
    })

    it('should return default settings for empty params', () => {
      const params = new URLSearchParams()
      const result = parseGameSettingsFromSearchParams(params)
      
      expect(result.gameLevel).toBe(GameLevel.Easy)
      expect(result.gameMode).toBe(GameMode.Sequence)
      expect(result.thaiAlphabetTypes).toEqual(Object.values(ThaiAlphabetType))
    })
  })

  describe('sanitizeUserInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeUserInput(input)
      expect(result).toBe('alert(&quot;xss&quot;)Hello')
    })

    it('should escape special characters', () => {
      const input = '& " \' /'
      const result = sanitizeUserInput(input)
      expect(result).toBe('&amp; &quot; &#x27; &#x2F;')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const result = sanitizeUserInput(input)
      expect(result).toBe('Hello World')
    })

    it('should handle Thai characters correctly', () => {
      const input = 'สวัสดี'
      const result = sanitizeUserInput(input)
      expect(result).toBe('สวัสดี')
    })

    it('should handle empty string', () => {
      const input = ''
      const result = sanitizeUserInput(input)
      expect(result).toBe('')
    })

    it('should handle complex XSS attempts', () => {
      const input = '<img src=x onerror="alert(1)">test</img>'
      const result = sanitizeUserInput(input)
      expect(result).toBe('test')
    })
  })

  describe('getValidationErrorMessage', () => {
    it('should return Zod error message', () => {
      const error = new z.ZodError([
        {
          code: 'custom',
          message: 'Invalid input',
          path: ['field']
        }
      ])
      
      const result = getValidationErrorMessage(error)
      expect(result).toBe('Invalid input')
    })

    it('should return Error message', () => {
      const error = new Error('Something went wrong')
      const result = getValidationErrorMessage(error)
      expect(result).toBe('Something went wrong')
    })

    it('should return default message for unknown error', () => {
      const result = getValidationErrorMessage('unknown error')
      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle null or undefined', () => {
      expect(getValidationErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getValidationErrorMessage(undefined)).toBe('An unexpected error occurred')
    })

    it('should return default message for empty Zod error', () => {
      const error = new z.ZodError([])
      const result = getValidationErrorMessage(error)
      expect(result).toBe('Validation error')
    })
  })
})