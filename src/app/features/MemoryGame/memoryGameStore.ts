// src/stores/MemoryGame-store.ts
import { createStore } from 'zustand/vanilla'

import type { ThaiAlphabet } from '@/app/types'
import thaiAlphabet from '@/app/utils/thaiAlphabet'
import generateUniqueNumbers from '../../utils/generateUniqueNumbers'
import {
  type GameState,
  type GameSettings,
  type Step,
  type StepHistory,
  GameMode,
  GameType,
} from './types.d'

export type MemoryGameActions = {
  startGame: (gameState?: GameState) => void
  endGame: () => void
  attemptAnswer: (attempted: ThaiAlphabet) => void
}

export type MemoryGameStore = GameState & MemoryGameActions & {
  settings: GameSettings
}

export const defaultInitState: GameState = {
  started: false,
  finished: false,
  currentStep: null,
  steps: [],
  alphabet: thaiAlphabet,
  settings: {
    gameType: GameType.Alphabet,
    gameMode: GameMode.Sequence,
    gameLevel: 'easy',
    languageMode: 'thai',
    numberOfOptions: 3
  }
}

const makeRandomOptions = (state: GameState, prompt?: ThaiAlphabet): ThaiAlphabet[] => {
  const { numberOfOptions = 3 } = state.settings as GameSettings

  let availableAlphabets = state.alphabet

  if (prompt) {
    availableAlphabets = state.alphabet.filter(alphabet => alphabet.alphabet !== prompt.alphabet)
  }

  const randomNumbers = generateUniqueNumbers(numberOfOptions - 1, availableAlphabets.length)

  const newRandomOptions = randomNumbers.map((number) => {
    return availableAlphabets[number]
  })

  // randomize the options
  const randomOptions = [...newRandomOptions, prompt].sort(() => Math.random() - 0.5)

  return randomOptions
}

const makeSequenceStep = (state: GameState, attempted?: ThaiAlphabet): Step => {
  // Ensure the alphabet array is sorted once (if needed)
  const sortedAlphabet = [...state.alphabet].sort((a, b) => a.order - b.order)

  let nextAlphabetIndex: number = 0

  if (attempted) {
    nextAlphabetIndex = sortedAlphabet.findIndex((alphabet) => alphabet.alphabet === attempted.alphabet) + 1
  }

  const nextAlphabet: ThaiAlphabet = sortedAlphabet[nextAlphabetIndex]

  // Generate random options for the current prompt
  const randomOptions = makeRandomOptions(state, nextAlphabet)

  return {
    prompt: nextAlphabet,
    options: randomOptions,
  }
}

// attempted?: ThaiAlphabet TODO - Fix this
const makeRandomStep = (state: GameState): Step => {
  const randomNumbers = generateUniqueNumbers(state.settings.numberOfOptions as number, state.alphabet.length)

  const randomOptions = randomNumbers.map((number) => {
    return state.alphabet[number]
  })

  const randomPromptIndex = Math.floor(Math.random() * randomOptions.length)

  const nextRandomPrompt = randomOptions[randomPromptIndex]

  // if (nextRandomPrompt.alphabet === attempted?.alphabet) {
  //   return makeRandomStep(state, attempted)
  // }
  
  return {
    prompt: nextRandomPrompt,
    options: randomOptions
  }
}

const makeNewStep = (state: GameState, attempted?: ThaiAlphabet): Step => {
  switch (state.settings.gameMode) {
    case GameMode.Sequence:
      return makeSequenceStep(state, attempted)
    case GameMode.Random:
      return makeRandomStep(state)
    default:
      return makeRandomStep(state)
  }
}

export const createMemoryGameStore = (
  initState: GameState = defaultInitState,
) => {
  return createStore<MemoryGameStore>()((set) => ({
    ...initState,
    startGame: (gameState: GameState = initState) => set(() => {
      const newStep = makeNewStep(gameState)

      return {
        ...initState,
        ...gameState,
        started: true,
        currentStep: newStep,
      }
    }),
    endGame: () => set(() => {
      return {
        ...initState,
        started: false
      }
    }),
    attemptAnswer: (attempted: ThaiAlphabet) => set((state) => {
      const {
        currentStep,
        settings,
        steps,
        alphabet,
      } = state

      if (!currentStep) {
        return state // If there's no current step, do nothing
      }

      const isCorrectAttemp = currentStep.prompt.alphabet === attempted.alphabet

      const attemptedStep = {
        ...currentStep,
        attempt: attempted,
        correct: isCorrectAttemp,
      }

      const newHistory: StepHistory[] = steps ? [
        ...steps as StepHistory[] || [],
        attemptedStep
      ] : [attemptedStep]

      if (!isCorrectAttemp) {
        return {
          ...state,
          steps: newHistory
        } as GameState
      }

      const isSequenceGameMode = settings.gameMode === 'sequence'
      const correctSteps = newHistory.filter((step) => step.correct)
      const gameIsOver = !!steps?.length && correctSteps?.length >= alphabet?.length

      if (isSequenceGameMode && gameIsOver) {
        return {
          ...state,
          started: false,
          finished: true,
          steps: newHistory,
          settings: state.settings,
        } as GameState
      }

      const newStep = makeNewStep(state, attempted)

      return {
        ...state,
        currentStep: newStep,
        steps: newHistory
      } as GameState
    })
  }))
}
