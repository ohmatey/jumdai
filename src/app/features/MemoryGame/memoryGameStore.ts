import { createStore } from 'zustand/vanilla'

import { type ThaiAlphabet, ThaiAlphabetType } from '@/app/types'
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
} from './types'
import { 
  DEFAULT_NUMBER_OF_OPTIONS, 
  INITIAL_POINTS_MULTIPLIER,
  INCORRECT_ANSWER_PENALTY,
  MIN_POINTS 
} from '@/app/constants/game.constants'

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
    numberOfOptions: DEFAULT_NUMBER_OF_OPTIONS,
    inputMode: InputMode.Options,
    thaiAlphabetTypes: Object.values(ThaiAlphabetType),
  }
}

export const filterAlphabetByTypes = (alphabet: ThaiAlphabet[], types: ThaiAlphabetType[]) => {
  return [...alphabet].filter((item) => {
    return types.includes(item.type)
  })
}

export const getCorrectAnswer = (currentStep?: Step) => {
  if (!currentStep || !currentStep.prompt) {
    console.error('Prompt or currentStep is not defined')
    return undefined
  }
  
  return currentStep?.options?.find(option => {
    return option.alphabet === currentStep.prompt.alphabet
  })
}

export const checkIsCorrectAttempt = (currentStep?: Step, attempted?: ThaiAlphabet) => {
  return currentStep?.prompt.alphabet === attempted?.alphabet
}

export const getTotalStepPoints = (steps: StepHistory[] = []) => {
  return steps.reduce((acc, step) => acc + step.points, 0)
}

const makeRandomOptions = (state: GameState, prompt?: ThaiAlphabet): ThaiAlphabet[] => {
  const {
    alphabet,
    settings,
  } = state
  const { numberOfOptions = 3 } = settings

  let availableAlphabets = alphabet

  if (prompt) {
    availableAlphabets = alphabet.filter(alphabet => alphabet.alphabet !== prompt.alphabet)
    availableAlphabets = filterAlphabetByTypes(availableAlphabets, [prompt?.type])
  }

  const randomNumbers = generateUniqueNumbers(numberOfOptions - 1, availableAlphabets.length)

  const newRandomOptions = randomNumbers.map((number) => {
    return availableAlphabets[number]
  })

  // randomize the options using Fisher-Yates shuffle for uniform distribution
  const randomOptions: ThaiAlphabet[] = prompt
    ? [...newRandomOptions, prompt]
    : [...newRandomOptions]
  for (let i = randomOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomOptions[i], randomOptions[j]] = [randomOptions[j], randomOptions[i]];
  }

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

  // Find the next alphabet to prompt
  // If there's no attempted alphabet, prompt the first alphabet
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
      points: randomOptions.length * INITIAL_POINTS_MULTIPLIER,
      inputMode: settings.inputMode,
    }
  }

  const isCorrect = checkIsCorrectAttempt(currentStep, attempted)

  return {
    prompt: isCorrect ? nextAlphabet : currentStep?.prompt,
    options: isCorrect ? randomOptions : currentStep?.options,
    points: Math.max(MIN_POINTS, currentStep?.points + (isCorrect ? 0 : -INCORRECT_ANSWER_PENALTY)),
    inputMode: settings?.inputMode,
  }
}

const getRandomAlphabet = (alphabet: ThaiAlphabet[], types: ThaiAlphabetType[]) => {
  const filteredAlphabet = filterAlphabetByTypes(alphabet, types)

  const randomIndex = Math.floor(Math.random() * filteredAlphabet.length)

  return filteredAlphabet[randomIndex]
}

const makeRandomStep = (state: GameState, attempted?: ThaiAlphabet): Step => {
  const {
    currentStep,
    alphabet,
    settings,
  } = state

  const randomOptions = Array.from({
    length: settings.numberOfOptions as number
  }, () => {
    return getRandomAlphabet(alphabet, settings.thaiAlphabetTypes)
  })

  const randomPromptIndex = Math.floor(Math.random() * randomOptions.length)

  const nextRandomPrompt = randomOptions[randomPromptIndex]

  // Generate random options for the first prompt
  if (!currentStep || attempted?.alphabet) {
    return {
      prompt: nextRandomPrompt,
      options: randomOptions,
      points: state?.currentStep?.points || (randomOptions.length * INITIAL_POINTS_MULTIPLIER),
      inputMode: state.settings.inputMode,
    }
  }

  const isCorrect = checkIsCorrectAttempt(currentStep, attempted)
  
  return {
    prompt: isCorrect ? nextRandomPrompt : currentStep.prompt,
    options: isCorrect ? randomOptions : currentStep.options,
    points: Math.max(MIN_POINTS, currentStep.points - (isCorrect ? 0 : INCORRECT_ANSWER_PENALTY)),
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
      try {
        const filteredAlphabet = filterAlphabetByTypes(gameState.alphabet, gameState.settings.thaiAlphabetTypes)

        if (filteredAlphabet.length === 0) {
          console.error('No alphabet items match the selected types')
          return {
            ...initState,
            ...gameState,
            started: false,
            finished: true,
          }
        }

        const newStep = makeNewStep({
          ...gameState,
          alphabet: filteredAlphabet,
        })

        return {
          ...initState,
          ...gameState,
          started: true,
          finished: false,
          currentStep: newStep,
          steps: [],
        }
      } catch (error) {
        console.error('Error starting game:', error)
        return {
          ...initState,
          ...gameState,
          started: false,
          finished: true,
        }
      }
    }),
    endGame: () => set(() => {
      return {
        ...initState,
        started: false
      }
    }),
    attemptAnswer: (attempted: ThaiAlphabet) => set((state) => {
      try {
        const {
          currentStep,
          settings,
          steps,
          alphabet,
        } = state

        const filteredAlphabet = filterAlphabetByTypes(alphabet, settings.thaiAlphabetTypes)

        if (!currentStep || !currentStep.prompt) {
          console.error('No current step to attempt')
          return state
        }

        const isCorrectAttempt = checkIsCorrectAttempt(currentStep, attempted)

        const attemptedStep: StepHistory = {
          ...currentStep,
          attempt: attempted,
          correct: isCorrectAttempt,
          points: isCorrectAttempt ? currentStep.points : 0
        }

        const newHistory: StepHistory[] = steps ? [
          ...steps,
          attemptedStep
        ] : [attemptedStep]

        // Check if game should end
        const isSequenceGameMode = settings.gameMode === GameMode.Sequence
        const isRandomGameMode = settings.gameMode === GameMode.Random
        const correctSteps = newHistory.filter((step) => step.correct)

        // For sequence mode: end when all alphabet items are correctly answered
        const sequenceGameComplete = isSequenceGameMode && correctSteps.length === filteredAlphabet.length
        
        // For random mode: end after a certain number of rounds (e.g., 20 questions)
        const randomGameComplete = isRandomGameMode && newHistory.length >= 20
        
        // Check if any points left (game over condition)
        const noPointsLeft = currentStep.points <= 0 && !isCorrectAttempt

        if (sequenceGameComplete || randomGameComplete || noPointsLeft) {
          return {
            ...state,
            alphabet: filteredAlphabet,
            currentStep: null,
            started: false,
            finished: true,
            steps: newHistory,
            settings: state.settings,
          } as GameState
        }

        // Continue game with new step
        const newStep = makeNewStep(state, isCorrectAttempt ? attempted : undefined)

        return {
          ...state,
          alphabet: filteredAlphabet,
          currentStep: newStep,
          steps: newHistory
        } as GameState
      } catch (error) {
        console.error('Error attempting answer:', error)
        return state
      }
    })
  }))
}
