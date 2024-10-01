

export interface ThaiAlphabet {
  alphabet: string
  romanization: string
  order: number
  isConsonant?: boolean
  consonantGroup?: 'low' | 'middle' | 'high'
  isVowel?: boolean
}

export type Reward = {
  step: Step
  attempt: ThaiAlphabet
  correct: boolean
  points: number
}

export interface Step {
  prompt: ThaiAlphabet
  correct: boolean
  attempt?: ThaiAlphabet
  options?: ThaiAlphabet[]
  rewards?: Reward[]
}

export interface GameSettings {
  gameType: 'alphabet' | 'word'
  gameMode: 'random' | 'sequence'
  gameLevel: 'easy' | 'medium' | 'hard'
  languageMode: 'thai' | 'english'
  numberOfOptions?: number
}

export interface GameState {
  started?: boolean
  steps: Step[]
  step: Step | null
  settings: GameSettings
}

export type StartGameAction = {
  type: 'start'
  payload: GameSettings
}

export type EndGameAction = {
  type: 'end'
}

export type AttemptAnswerAction = {
  type: 'attempt'
  payload: {
    attempt: ThaiAlphabet
  }
}

export type GameAction = StartGameAction | EndGameAction | AttemptAnswerAction