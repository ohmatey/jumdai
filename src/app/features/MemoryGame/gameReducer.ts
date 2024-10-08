import thaiAlphabet from '../../utils/thaiAlphabet'
import generateUniqueRandomNumbers from '../../utils/generateUniqueNumbers'
import type {
  GameAction,
  GameState,
  Reward,
  Step
} from './types'
import type { ThaiAlphabet } from '@/app/types'

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'start':
      const isSequenceGameMode = action.payload.gameMode === 'sequence'

      let nextPrompt: ThaiAlphabet
      let newOptions: ThaiAlphabet[] = []
      
      if (isSequenceGameMode) {
        // get the last alphabet from the steps
        const lastCorrectStep = [...state.steps].reverse().find((step) => step.correct)

        // get the last alphabet index
        let lastStepIndex: number
        if (lastCorrectStep) {
          lastStepIndex = thaiAlphabet.findIndex(
            (alphabet) => alphabet.alphabet === lastCorrectStep.prompt.alphabet
          )
        } else {
          lastStepIndex = -1 // Start before the first alphabet
        }

        // get the next alphabet in the sequence
        const nextAlphabetIndex = lastStepIndex + 1
        let nextAlphabet: ThaiAlphabet

        if (nextAlphabetIndex >= thaiAlphabet.length) {
          // if the next alphabet index is more than the length of the alphabet, the game is over
          return {
            ...state,
            step: null,
            steps: [],
            started: false
          }
        } else {
          nextAlphabet = thaiAlphabet[nextAlphabetIndex]
        }

        const availableAlphabets = thaiAlphabet.filter(
          (alphabet) => alphabet.alphabet !== nextAlphabet.alphabet
        )

        const { numberOfOptions = 3 } = action.payload
        const newRandomOptions = generateUniqueRandomNumbers(numberOfOptions - 1, availableAlphabets.length).map((number) => {
          return availableAlphabets[number]
        })

        // randomize the options
        const randomOptions = [...newRandomOptions, nextAlphabet].sort(() => Math.random() - 0.5)

        newOptions = randomOptions
        nextPrompt = nextAlphabet
      } else {
        // else gamemode is random
        const randomNumbers = generateUniqueRandomNumbers(action.payload.numberOfOptions as number, thaiAlphabet.length)

        const randomOptions = randomNumbers.map((number) => {
          return thaiAlphabet[number]
        })

        const randomPromptIndex = Math.floor(Math.random() * randomOptions.length)

        nextPrompt = randomOptions[randomPromptIndex]
        newOptions = randomOptions
      }

      return {
        ...state,
        started: true,
        step: {
          prompt: nextPrompt,
          correct: false,
          options: newOptions
        },
        settings: {
          ...state.settings,
          ...action.payload,
        },
      }
    case 'end':
      return {
        ...state,
        started: false,
        step: null,
        steps: []
      }

    case 'attempt':
      const { attempt } = action.payload
      const currentStep = { ...state?.step } as Step
      const correct = currentStep.prompt.alphabet === attempt.alphabet

      const reward: Reward = {
        step: currentStep,
        attempt,
        correct,
        points: correct ? 1 : 0
      }

      const rewards = correct ? [
        ...currentStep.rewards || [],
        reward
      ] : currentStep.rewards || []

      const updatedStep = {
        ...currentStep,
        rewards,
        correct: correct
      }

      const updatedStepHistory = {
        ...currentStep,
        rewards,
        attempt,
        correct: correct
      }

      return {
        ...state,
        step: updatedStep,
        steps: [
          ...state.steps,
          updatedStepHistory
        ]
      }

    default:
      return state
  }
}

export default gameReducer