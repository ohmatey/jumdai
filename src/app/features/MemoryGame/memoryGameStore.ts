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
  InputMode,
  GameLevel,
  LanguageMode,
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
    gameLevel: GameLevel.Easy,
    languageMode: LanguageMode.Thai,
    numberOfOptions: 3,
    inputMode: InputMode.Options,
  }
}

export const getCorrectAnswer = (currentStep?: Step) => currentStep?.options?.find(option => {
  if (!currentStep || !currentStep.prompt) {
    throw new Error('Prompt or currentStep is not defined')
  }

  return option.alphabet === currentStep.prompt.alphabet
})

export const checkIsCorrectAttempt = (currentStep?: Step, attempted?: ThaiAlphabet) => {
  return currentStep?.prompt.alphabet === attempted?.alphabet
}

export const getTotalStepPoints = (steps: StepHistory[] = []) => {
  return steps.reduce((acc, step) => acc + step.points, 0)
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
  const {
    currentStep,
    alphabet,
    settings,
  } = state

  // Ensure the alphabet array is sorted once
  const sortedAlphabet = [...alphabet].sort((a, b) => a.order - b.order)

  let nextAlphabetIndex: number = 0

  if (attempted) {
    nextAlphabetIndex = sortedAlphabet.findIndex((alphabet) => alphabet.alphabet === attempted.alphabet) + 1
  }

  const nextAlphabet: ThaiAlphabet = sortedAlphabet[nextAlphabetIndex]

  // Generate random options for the current prompt
  const randomOptions = makeRandomOptions(state, nextAlphabet)

  if (!currentStep) {
    return {
      prompt: nextAlphabet,
      options: randomOptions,
      points: randomOptions.length,
      inputMode: settings.inputMode,
    }
  }

  const isCorrect = checkIsCorrectAttempt(currentStep, attempted)

  return {
    prompt: isCorrect ? nextAlphabet : currentStep?.prompt,
    options: isCorrect ? randomOptions : currentStep?.options,
    points: currentStep?.points + (isCorrect ? 0 : -1),
    inputMode: settings?.inputMode,
  }
}

const makeRandomStep = (state: GameState, attempted?: ThaiAlphabet): Step => {
  const {
    currentStep,
    alphabet,
    settings,
  } = state

  const randomNumbers = generateUniqueNumbers(settings.numberOfOptions as number, alphabet.length)

  const randomOptions = randomNumbers.map((number) => {
    return alphabet[number]
  })

  const randomPromptIndex = Math.floor(Math.random() * randomOptions.length)

  const nextRandomPrompt = randomOptions[randomPromptIndex]

  // Generate random options for the first prompt
  if (!currentStep || attempted?.alphabet) {
    return {
      prompt: nextRandomPrompt,
      options: randomOptions,
      points: state?.currentStep?.points || randomOptions.length,
      inputMode: state.settings.inputMode,
    }
  }

  const isCorrect = checkIsCorrectAttempt(currentStep, attempted)
  
  return {
    prompt: isCorrect ? nextRandomPrompt : currentStep.prompt,
    options: isCorrect ? randomOptions : currentStep.options,
    points: currentStep.points - (isCorrect ? 0 : 1),
    inputMode: settings.inputMode,
  }
}

const makeNewStep = (state: GameState, attempted?: ThaiAlphabet): Step => {
  switch (state.settings.gameMode) {
    case GameMode.Sequence:
      return makeSequenceStep(state, attempted)
    case GameMode.Random:
      return makeRandomStep(state, attempted)
    default:
      return makeRandomStep(state, attempted)
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

      const isCorrectAttempt = checkIsCorrectAttempt(currentStep, attempted)

      const attemptedStep = {
        ...currentStep,
        attempt: attempted,
        correct: isCorrectAttempt,
        points: isCorrectAttempt ? currentStep.points : 0
      }

      const newHistory: StepHistory[] = steps ? [
        ...steps as StepHistory[] || [],
        attemptedStep
      ] : [attemptedStep]

      const newStep = makeNewStep(state, attempted)

      if (!isCorrectAttempt) {
        return {
          ...state,
          currentStep: newStep,
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
      
      return {
        ...state,
        currentStep: newStep,
        steps: newHistory
      } as GameState
    })
  }))
}
