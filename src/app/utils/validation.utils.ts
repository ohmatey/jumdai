import { z } from 'zod'
import { 
  GameType, 
  GameMode, 
  GameLevel, 
  LanguageMode, 
  InputMode,
  type GameSettings 
} from '@/app/features/MemoryGame/types'
import { ThaiAlphabetType } from '@/app/types'
import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'
import {
  gameSearchParamsSchema,
  gameSettingsSchema,
  numberOfOptionsSchema,
  thaiAlphabetTypesSchema,
} from '@/app/validations/game.schemas'
import { DEFAULT_NUMBER_OF_OPTIONS } from '@/app/constants/game.constants'

/**
 * Safely parse and validate game settings from URL search parameters
 */
export function parseGameSettingsFromSearchParams(
  searchParams: URLSearchParams
): GameSettings {
  try {
    // Convert URLSearchParams to plain object
    const paramsObject: Record<string, string | string[]> = {}
    
    searchParams.forEach((value, key) => {
      if (key === 'alphabet-type') {
        // Handle multiple alphabet types
        paramsObject[key] = searchParams.getAll(key)
      } else {
        paramsObject[key] = value
      }
    })

    // Validate the raw params
    const validatedParams = gameSearchParamsSchema.parse(paramsObject)

    // Transform and validate to game settings
    const settings: GameSettings = {
      gameType: parseEnumValue(
        validatedParams.type,
        GameType,
        defaultInitState.settings.gameType
      ),
      gameMode: parseEnumValue(
        validatedParams.mode,
        GameMode,
        defaultInitState.settings.gameMode
      ),
      gameLevel: parseEnumValue(
        validatedParams.level,
        GameLevel,
        defaultInitState.settings.gameLevel
      ),
      languageMode: parseEnumValue(
        validatedParams['language-mode'],
        LanguageMode,
        defaultInitState.settings.languageMode
      ),
      inputMode: parseEnumValue(
        validatedParams['input-mode'],
        InputMode,
        defaultInitState.settings.inputMode
      ),
      numberOfOptions: parseNumberOfOptions(validatedParams['number-options']),
      thaiAlphabetTypes: parseThaiAlphabetTypes(validatedParams['alphabet-type']),
    }

    // Final validation of the complete settings object
    return gameSettingsSchema.parse(settings)
  } catch (error) {
    console.error('Error parsing game settings from URL:', error)
    // Return default settings if parsing fails
    return defaultInitState.settings
  }
}

/**
 * Safely parse enum values with validation
 */
function parseEnumValue<T extends Record<string, string>>(
  value: string | undefined,
  enumObj: T,
  defaultValue: T[keyof T]
): T[keyof T] {
  if (!value) return defaultValue
  
  const enumValues = Object.values(enumObj) as string[]
  if (enumValues.includes(value)) {
    return value as T[keyof T]
  }
  
  return defaultValue
}

/**
 * Parse and validate number of options
 */
function parseNumberOfOptions(value: string | undefined): number {
  if (!value) return DEFAULT_NUMBER_OF_OPTIONS
  
  try {
    return numberOfOptionsSchema.parse(value)
  } catch {
    return DEFAULT_NUMBER_OF_OPTIONS
  }
}

/**
 * Parse and validate Thai alphabet types
 */
function parseThaiAlphabetTypes(
  value: string | string[] | undefined
): ThaiAlphabetType[] {
  if (!value) {
    return Object.values(ThaiAlphabetType)
  }

  const types = Array.isArray(value) ? value : [value]
  
  try {
    const validTypes = types
      .filter(type => Object.values(ThaiAlphabetType).includes(type as ThaiAlphabetType))
      .map(type => type as ThaiAlphabetType)
    
    return thaiAlphabetTypesSchema.parse(validTypes)
  } catch {
    return Object.values(ThaiAlphabetType)
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeUserInput(input: string): string {
  // Remove any HTML tags
  const withoutHtml = input.replace(/<[^>]*>/g, '')
  
  // Escape special characters
  const escaped = withoutHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  // Trim whitespace
  return escaped.trim()
}

/**
 * Create a safe error message for validation errors
 */
export function getValidationErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    // Return the first error message
    return error.errors[0]?.message || 'Validation error'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}