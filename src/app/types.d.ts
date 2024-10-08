export interface ThaiAlphabet {
  alphabet: string
  thaiExamplePrefix?: string
  thaiExampleDescription?: string
  romanTransliterationPrefix?: string
  romanTransliteration?: string
  romanDescription?: string
  order: number
  isConsonant?: boolean
  consonantGroup?: 'low' | 'middle' | 'high'
  isVowel?: boolean
  imageSrc?: string
}