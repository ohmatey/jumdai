import { z } from 'zod'
import { 
  GameType, 
  GameMode, 
  GameLevel, 
  LanguageMode, 
  InputMode 
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'
import {
  MIN_NUMBER_OF_OPTIONS,
  MAX_NUMBER_OF_OPTIONS,
  DEFAULT_NUMBER_OF_OPTIONS,
  MIN_ALPHABET_TYPES_SELECTED,
  GAME_ID_MIN,
  GAME_ID_MAX,
  MAX_TEXT_INPUT_LENGTH,
  MIN_TEXT_INPUT_LENGTH,
  VALIDATION_ERROR_MESSAGES,
} from '@/app/constants/game.constants'

/**
 * Schema for validating game IDs
 */
export const gameIdSchema = z.string()
  .regex(/^\d+$/, VALIDATION_ERROR_MESSAGES.INVALID_GAME_ID)
  .transform(Number)
  .pipe(z.number().int().min(GAME_ID_MIN).max(GAME_ID_MAX))

/**
 * Schema for validating number of options
 */
export const numberOfOptionsSchema = z.coerce
  .number()
  .int()
  .min(MIN_NUMBER_OF_OPTIONS, {
    message: `Must be at least ${MIN_NUMBER_OF_OPTIONS}`
  })
  .max(MAX_NUMBER_OF_OPTIONS, {
    message: `Must be at most ${MAX_NUMBER_OF_OPTIONS}`
  })
  .default(DEFAULT_NUMBER_OF_OPTIONS)

/**
 * Schema for validating Thai alphabet types array
 */
export const thaiAlphabetTypesSchema = z
  .array(z.nativeEnum(ThaiAlphabetType))
  .min(MIN_ALPHABET_TYPES_SELECTED, {
    message: VALIDATION_ERROR_MESSAGES.NO_ALPHABET_TYPES_SELECTED
  })
  .default([ThaiAlphabetType.Consonant, ThaiAlphabetType.Vowel])

/**
 * Schema for validating game settings
 */
export const gameSettingsSchema = z.object({
  gameType: z.nativeEnum(GameType, {
    errorMap: () => ({ message: 'Invalid game type' })
  }),
  gameMode: z.nativeEnum(GameMode, {
    errorMap: () => ({ message: 'Invalid game mode' })
  }),
  gameLevel: z.nativeEnum(GameLevel, {
    errorMap: () => ({ message: 'Invalid game level' })
  }),
  languageMode: z.nativeEnum(LanguageMode, {
    errorMap: () => ({ message: 'Invalid language mode' })
  }),
  inputMode: z.nativeEnum(InputMode, {
    errorMap: () => ({ message: 'Invalid input mode' })
  }),
  numberOfOptions: numberOfOptionsSchema.optional(),
  thaiAlphabetTypes: thaiAlphabetTypesSchema,
})

/**
 * Schema for validating URL search parameters
 */
export const gameSearchParamsSchema = z.object({
  level: z.string().optional(),
  mode: z.string().optional(),
  type: z.string().optional(),
  'language-mode': z.string().optional(),
  'number-options': z.string().optional(),
  'input-mode': z.string().optional(),
  'alphabet-type': z.union([z.string(), z.array(z.string())]).optional(),
})

/**
 * Schema for validating user text input (for free text input mode)
 */
export const userTextInputSchema = z.string()
  .transform((val) => val.trim()) // Trim whitespace first
  .refine((val) => val.length >= MIN_TEXT_INPUT_LENGTH, {
    message: VALIDATION_ERROR_MESSAGES.TEXT_TOO_SHORT
  })
  .refine((val) => val.length <= MAX_TEXT_INPUT_LENGTH, {
    message: VALIDATION_ERROR_MESSAGES.TEXT_TOO_LONG
  })
  .refine((val) => !/<[^>]*>/g.test(val), {
    message: 'HTML tags are not allowed'
  })

/**
 * Schema for game form input validation
 */
export const gameFormSchema = gameSettingsSchema.transform((data) => {
  // Remove numberOfOptions for sequence mode
  if (data.gameMode === GameMode.Sequence) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { numberOfOptions, ...rest } = data
    return { ...rest, numberOfOptions: undefined }
  }
  return data
})

/**
 * Type inference from schemas
 */
export type GameSettings = z.infer<typeof gameSettingsSchema>
export type GameFormInput = z.infer<typeof gameFormSchema>
export type GameSearchParams = z.infer<typeof gameSearchParamsSchema>
export type UserTextInput = z.infer<typeof userTextInputSchema>