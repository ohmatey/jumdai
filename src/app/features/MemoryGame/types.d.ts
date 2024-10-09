export type Reward = {
  step: Step
  attempt: ThaiAlphabet
  correct: boolean
  points: number
}

export interface Step {
  prompt: ThaiAlphabet
  options?: ThaiAlphabet[]
}

export interface StepHistory extends Step {
  prompt: ThaiAlphabet
  correct: boolean
  attempt: ThaiAlphabet
  rewards?: Reward[]
}

export enum GameType {
  Alphabet = 'alphabet',
  Word = 'word',
}

export enum GameMode {
  Sequence = 'sequence',
  Random = 'random',
}

export interface GameSettings {
  gameType: GameType
  gameMode: GameMode
  gameLevel: 'easy' | 'medium' | 'hard'
  languageMode: 'thai' | 'english'
  numberOfOptions?: number
}

export interface GameState {
  alphabet: ThaiAlphabet[]
  started: boolean
  finished: boolean
  steps?: StepHistory[] | []
  currentStep?: Step | null
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