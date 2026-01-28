import { type ThaiAlphabet, ThaiAlphabetType } from '@/app/types'

export type Reward = {
  step: Step
  attempt: ThaiAlphabet
  correct: boolean
  points: number
}

export enum InputMode {
  Options = 'options',
  Input = 'input',
}

export interface Step {
  prompt: ThaiAlphabet
  options?: ThaiAlphabet[]
  points: number
  inputMode: InputMode
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

export enum GameLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum LanguageMode {
  Thai = 'thai',
  English = 'english',
}

export interface GameSettings {
  gameType: GameType
  gameMode: GameMode
  gameLevel: GameLevel
  languageMode: LanguageMode
  numberOfOptions?: number
  inputMode: InputMode
  thaiAlphabetTypes: ThaiAlphabetType[]
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