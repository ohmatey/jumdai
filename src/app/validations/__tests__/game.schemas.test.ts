import {
  gameIdSchema,
  numberOfOptionsSchema,
  thaiAlphabetTypesSchema,
  gameSettingsSchema,
  userTextInputSchema,
  gameFormSchema,
} from '../game.schemas'
import { 
  GameType, 
  GameMode, 
  GameLevel, 
  LanguageMode, 
  InputMode 
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'

describe('game.schemas', () => {
  describe('gameIdSchema', () => {
    it('should validate numeric string game IDs', () => {
      expect(gameIdSchema.parse('1234')).toBe(1234)
      expect(gameIdSchema.parse('99999')).toBe(99999)
    })

    it('should reject non-numeric strings', () => {
      expect(() => gameIdSchema.parse('abc')).toThrow()
      expect(() => gameIdSchema.parse('12a34')).toThrow()
    })

    it('should reject IDs outside valid range', () => {
      expect(() => gameIdSchema.parse('999')).toThrow()
      expect(() => gameIdSchema.parse('100000')).toThrow()
    })
  })

  describe('numberOfOptionsSchema', () => {
    it('should validate numbers within range', () => {
      expect(numberOfOptionsSchema.parse(2)).toBe(2)
      expect(numberOfOptionsSchema.parse(6)).toBe(6)
      expect(numberOfOptionsSchema.parse(4)).toBe(4)
    })

    it('should coerce string numbers', () => {
      expect(numberOfOptionsSchema.parse('3')).toBe(3)
      expect(numberOfOptionsSchema.parse('5')).toBe(5)
    })

    it('should reject numbers outside range', () => {
      expect(() => numberOfOptionsSchema.parse(1)).toThrow()
      expect(() => numberOfOptionsSchema.parse(7)).toThrow()
    })

    it('should use default value for undefined', () => {
      expect(numberOfOptionsSchema.parse(undefined)).toBe(3)
    })
  })

  describe('thaiAlphabetTypesSchema', () => {
    it('should validate valid alphabet types', () => {
      const result = thaiAlphabetTypesSchema.parse([
        ThaiAlphabetType.Consonant,
        ThaiAlphabetType.Vowel
      ])
      expect(result).toEqual([ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel])
    })

    it('should reject empty array', () => {
      expect(() => thaiAlphabetTypesSchema.parse([])).toThrow()
    })

    it('should reject invalid alphabet types', () => {
      expect(() => thaiAlphabetTypesSchema.parse(['invalid'])).toThrow()
    })

    it('should use default value for undefined', () => {
      const result = thaiAlphabetTypesSchema.parse(undefined)
      expect(result).toEqual([ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel])
    })
  })

  describe('gameSettingsSchema', () => {
    const validSettings = {
      gameType: GameType.Alphabet,
      gameMode: GameMode.Sequence,
      gameLevel: GameLevel.Easy,
      languageMode: LanguageMode.Thai,
      inputMode: InputMode.Options,
      numberOfOptions: 3,
      thaiAlphabetTypes: [ThaiAlphabetType.Consonant]
    }

    it('should validate complete valid settings', () => {
      const result = gameSettingsSchema.parse(validSettings)
      expect(result).toEqual(validSettings)
    })

    it('should validate settings without optional fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { numberOfOptions, ...requiredSettings } = validSettings
      const result = gameSettingsSchema.parse(requiredSettings)
      expect(result.numberOfOptions).toBeUndefined()
    })

    it('should reject invalid enum values', () => {
      expect(() => gameSettingsSchema.parse({
        ...validSettings,
        gameType: 'invalid'
      })).toThrow()

      expect(() => gameSettingsSchema.parse({
        ...validSettings,
        gameMode: 'invalid'
      })).toThrow()
    })
  })

  describe('userTextInputSchema', () => {
    it('should validate valid text input', () => {
      expect(userTextInputSchema.parse('ก')).toBe('ก')
      expect(userTextInputSchema.parse('Hello')).toBe('Hello')
      expect(userTextInputSchema.parse('  test  ')).toBe('test')
    })

    it('should reject empty string', () => {
      expect(() => userTextInputSchema.parse('')).toThrow()
      expect(() => userTextInputSchema.parse('   ')).toThrow()
    })

    it('should reject text that is too long', () => {
      const longText = 'a'.repeat(101)
      expect(() => userTextInputSchema.parse(longText)).toThrow()
    })

    it('should reject HTML tags', () => {
      expect(() => userTextInputSchema.parse('<script>alert(1)</script>')).toThrow()
      expect(() => userTextInputSchema.parse('<div>test</div>')).toThrow()
    })

    it('should accept Thai characters', () => {
      expect(userTextInputSchema.parse('สวัสดี')).toBe('สวัสดี')
      expect(userTextInputSchema.parse('ก ข ค')).toBe('ก ข ค')
    })
  })

  describe('gameFormSchema', () => {
    const validFormData = {
      gameType: GameType.Alphabet,
      gameMode: GameMode.Random,
      gameLevel: GameLevel.Medium,
      languageMode: LanguageMode.English,
      inputMode: InputMode.Input,
      numberOfOptions: 4,
      thaiAlphabetTypes: [ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel]
    }

    it('should validate valid form data', () => {
      const result = gameFormSchema.parse(validFormData)
      expect(result).toEqual(validFormData)
    })

    it('should remove numberOfOptions in sequence mode', () => {
      const result = gameFormSchema.parse({
        ...validFormData,
        gameMode: GameMode.Sequence,
        numberOfOptions: 4
      })
      expect(result.gameMode).toBe(GameMode.Sequence)
      expect(result.numberOfOptions).toBeUndefined()
    })

    it('should allow sequence mode without numberOfOptions', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { numberOfOptions, ...dataWithoutOptions } = validFormData
      const result = gameFormSchema.parse({
        ...dataWithoutOptions,
        gameMode: GameMode.Sequence
      })
      expect(result.gameMode).toBe(GameMode.Sequence)
      expect(result.numberOfOptions).toBeUndefined()
    })
  })
})