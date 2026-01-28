/**
 * Integration tests for comprehensive Zod validation implementation
 * This tests the complete validation workflow from URL parameters to form validation
 */

import { parseGameSettingsFromSearchParams } from '@/app/utils/validation.utils'
import { 
  gameFormSchema, 
  userTextInputSchema,
  gameIdSchema,
  numberOfOptionsSchema 
} from '../game.schemas'
import { 
  GameType, 
  GameMode, 
  GameLevel, 
  LanguageMode, 
  InputMode 
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'

describe('Zod Validation Integration', () => {
  describe('Complete workflow validation', () => {
    it('should validate complete game creation workflow', () => {
      // 1. Validate game ID from URL
      const gameId = gameIdSchema.parse('12345')
      expect(gameId).toBe(12345)

      // 2. Parse URL parameters with validation
      const searchParams = new URLSearchParams({
        'level': 'medium',
        'mode': 'random',
        'type': 'alphabet',
        'language-mode': 'english',
        'input-mode': 'input',
        'number-options': '4'
      })
      searchParams.append('alphabet-type', 'consonant')
      searchParams.append('alphabet-type', 'vowel')

      const gameSettings = parseGameSettingsFromSearchParams(searchParams)
      
      expect(gameSettings).toEqual({
        gameLevel: GameLevel.Medium,
        gameMode: GameMode.Random,
        gameType: GameType.Alphabet,
        languageMode: LanguageMode.English,
        inputMode: InputMode.Input,
        numberOfOptions: 4,
        thaiAlphabetTypes: [ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel]
      })

      // 3. Validate form submission
      const validatedForm = gameFormSchema.parse(gameSettings)
      expect(validatedForm).toEqual(gameSettings)

      // 4. Validate user text input (for free text mode)
      const userInput = userTextInputSchema.parse('ก')
      expect(userInput).toBe('ก')
    })

    it('should handle malicious input safely', () => {
      // Test XSS prevention in URL parameters
      const maliciousParams = new URLSearchParams({
        'level': '<script>alert("xss")</script>',
        'mode': 'javascript:alert(1)',
        'number-options': '999999'
      })

      const settings = parseGameSettingsFromSearchParams(maliciousParams)
      
      // Should fall back to safe defaults
      expect(settings.gameLevel).toBe(GameLevel.Easy)
      expect(settings.gameMode).toBe(GameMode.Sequence)
      expect(settings.numberOfOptions).toBe(3)
    })

    it('should validate number constraints properly', () => {
      // Test numberOfOptions validation with various inputs
      expect(numberOfOptionsSchema.parse('2')).toBe(2)
      expect(numberOfOptionsSchema.parse('6')).toBe(6)
      expect(() => numberOfOptionsSchema.parse('1')).toThrow()
      expect(() => numberOfOptionsSchema.parse('7')).toThrow()
      expect(() => numberOfOptionsSchema.parse('abc')).toThrow()
    })

    it('should prevent HTML injection in text inputs', () => {
      // These should all fail validation
      expect(() => userTextInputSchema.parse('<script>alert(1)</script>')).toThrow()
      expect(() => userTextInputSchema.parse('<img src=x onerror=alert(1)>')).toThrow()
      expect(() => userTextInputSchema.parse('<div>test</div>')).toThrow()

      // These should pass
      expect(userTextInputSchema.parse('ก')).toBe('ก')
      expect(userTextInputSchema.parse('valid text')).toBe('valid text')
      expect(userTextInputSchema.parse('  trimmed  ')).toBe('trimmed')
    })

    it('should validate enum values strictly', () => {
      const validSettings = {
        gameType: GameType.Alphabet,
        gameMode: GameMode.Random,
        gameLevel: GameLevel.Hard,
        languageMode: LanguageMode.Thai,
        inputMode: InputMode.Options,
        thaiAlphabetTypes: [ThaiAlphabetType.Consonant]
      }

      expect(() => gameFormSchema.parse(validSettings)).not.toThrow()

      // Invalid enum values should fail
      expect(() => gameFormSchema.parse({
        ...validSettings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameLevel: 'invalid' as any
      })).toThrow()

      expect(() => gameFormSchema.parse({
        ...validSettings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameMode: 'invalid' as any
      })).toThrow()
    })

    it('should enforce business rules through validation', () => {
      // numberOfOptions should be removed in sequence mode
      const result = gameFormSchema.parse({
        gameType: GameType.Alphabet,
        gameMode: GameMode.Sequence,
        gameLevel: GameLevel.Easy,
        languageMode: LanguageMode.Thai,
        inputMode: InputMode.Options,
        numberOfOptions: 4, // This should be removed by transform
        thaiAlphabetTypes: [ThaiAlphabetType.Consonant]
      })
      expect(result.numberOfOptions).toBeUndefined()

      // But it should be allowed without numberOfOptions
      expect(() => gameFormSchema.parse({
        gameType: GameType.Alphabet,
        gameMode: GameMode.Sequence,
        gameLevel: GameLevel.Easy,
        languageMode: LanguageMode.Thai,
        inputMode: InputMode.Options,
        thaiAlphabetTypes: [ThaiAlphabetType.Consonant]
      })).not.toThrow()
    })

    it('should provide proper TypeScript inference', () => {
      const settings = parseGameSettingsFromSearchParams(new URLSearchParams())
      
      // These should have proper types inferred by TypeScript
      expect(typeof settings.gameLevel).toBe('string')
      expect(typeof settings.numberOfOptions).toBe('number')
      expect(Array.isArray(settings.thaiAlphabetTypes)).toBe(true)
      
      // The enum values should be correctly typed
      expect(Object.values(GameLevel)).toContain(settings.gameLevel)
      expect(Object.values(GameMode)).toContain(settings.gameMode)
    })
  })
})