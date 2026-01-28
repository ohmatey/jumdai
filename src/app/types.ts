export enum ThaiAlphabetType {
  Consonant = 'consonant',
  Vowel = 'vowel',
  Tone = 'tone',
  Other = 'other',
}

export enum ConsonantGroup {
  Low = 'low',
  Middle = 'middle',
  High = 'high',
}

export enum VowelGroup {
  first = 'first',
  second = 'second',
  third = 'third',
}

export enum VowelGroupOrder {
  first = 1,
  second = 2,
  third = 3,
  fourth = 4,
}

export enum SpokenLength {
  Short = 'short',
  Long = 'long',
}

// vowel type is front, central, or back
// vowel height is high, mid, or low
// vowel backness is front, central, or back
// vowel roundedness is rounded or unrounded
// vowel length is short or long
// vowel tenseness is lax or tense
// vowel nasality is nasal or oral
// vowel rhoticity is rhotic or non-rhotic

export enum spokenType {
  ShortFrontUnrounded = 'short front unrounded',
  ShortFrontRounded = 'short front rounded',
  ShortCentralUnrounded = 'short central unrounded',
  ShortCentralRounded = 'short central rounded',
  ShortBackUnrounded = 'short back unrounded',
  ShortBackRounded = 'short back rounded',
  LongFrontUnrounded = 'long front unrounded',
  LongFrontRounded = 'long front rounded',
  LongCentralUnrounded = 'long central unrounded',
  LongCentralRounded = 'long central rounded',
  LongBackUnrounded = 'long back unrounded',
  LongBackRounded = 'long back rounded',
}

export interface ThaiAlphabet {
  order: number
  imageSrc?: string

  alphabet: string
  type: ThaiAlphabetType
  
  thaiExamplePrefix?: string
  thaiExampleDescription?: string
  romanTransliterationPrefix?: string
  romanTransliteration?: string
  romanDescription?: string

  consonantGroup?: ConsonantGroup
  vowelGroup?: VowelGroup
  vowelGroupOrder?: VowelGroupOrder
  spokenLength?: SpokenLength
  spokenType?: spokenType
}