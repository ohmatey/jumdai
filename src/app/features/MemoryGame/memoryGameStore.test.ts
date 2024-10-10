import { createMemoryGameStore, defaultInitState, getCorrectAnswer } from './memoryGameStore'
import { type GameState, GameMode } from './types'
import type { ThaiAlphabet } from '@/app/types'
import thaiAlphabet from '@/app/utils/thaiAlphabet'

const alphabet: ThaiAlphabet[] = thaiAlphabet.slice(0, 5)

// Create a custom initState for testing
const customInitState: GameState = {
  ...defaultInitState,
  alphabet,
  steps: [],
  settings: {
    ...defaultInitState.settings,
    gameMode: GameMode.Sequence,
    numberOfOptions: 3
  }
}

const customRandomInitState: GameState = {
  ...customInitState,
  settings: {
    ...customInitState.settings,
    gameMode: GameMode.Random
  }
}

const getWrongAnswer = (currentStep: ThaiAlphabet) => {
  const wrongAnswer = thaiAlphabet.find(alphabet => alphabet.alphabet !== currentStep.alphabet)

  if (!wrongAnswer) {
    throw new Error('Wrong answer is not defined')
  }

  return wrongAnswer
}

// Utility function to create a game store with custom initial state
const createStore = (initState = customInitState) => createMemoryGameStore(initState)

describe('MemoryGame Store', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
  })

  test('initial state should match defaultInitState', () => {
    expect(store.getState()).toMatchObject({
      ...customInitState,
      settings: defaultInitState.settings,
      started: false,
      currentStep: null,
      steps: []
    })

    expect(store.getState().alphabet).toEqual(customInitState.alphabet)
  })

  test('startGame should update started to true', () => {
    store.getState().startGame(customInitState)
    const { started, alphabet, currentStep, settings } = store.getState()

    const { numberOfOptions = 3 } = customInitState.settings
    
    expect(started).toBe(true)
    expect(currentStep).toBeDefined()
    expect(currentStep?.options).toHaveLength(numberOfOptions)
    expect(currentStep?.points).toBe(numberOfOptions)
    expect(alphabet).toEqual(customInitState.alphabet)
    expect(settings).toEqual(customInitState.settings)
  })

  test('endGame should reset state to initial state', () => {
    store.getState().startGame(customInitState)
    store.getState().endGame()
    
    expect(store.getState().started).toBe(false)
    expect(store.getState().steps).toEqual([])
    expect(store.getState().currentStep).toBeNull()
  })

  test('attemptAnswer should mark correct answer and update history', () => {
    // Start the game and create an initial step
    store.getState().startGame(customInitState)

    const correctAnswer = store.getState()?.currentStep?.options?.find((option: ThaiAlphabet) => option.alphabet === store.getState()?.currentStep?.prompt.alphabet)

    // Attempt the correct answer
    store.getState().attemptAnswer(correctAnswer)
    
    const { steps } = store.getState()
    
    expect(steps?.length).toBe(1)
    expect(steps?.[0].correct).toBe(true)
    expect(steps?.[0].points).toBe(store.getState()?.currentStep?.points)
    expect(steps?.[0].attempt.alphabet).toBe(correctAnswer.alphabet)
  })

  test('attemptAnswer should mark incorrect answer and update history', () => {
    store.getState().startGame(customInitState)

    const incorrectAnswer = getWrongAnswer(store.getState()?.currentStep?.prompt)

    // Attempt an incorrect answer
    store.getState().attemptAnswer(incorrectAnswer)
    
    const { steps } = store.getState()
    
    expect(steps?.length).toBe(1)
    expect(steps?.[0].correct).toBe(false)
    expect(steps?.[0].attempt.alphabet).toBe(incorrectAnswer.alphabet)

    // prompt should be the same as the previous step
    expect(store.getState()?.currentStep?.prompt).toEqual(store.getState()?.steps?.[0]?.prompt)
  })

  test('makeNewStep should generate a new step correctly for sequence mode', () => {
    store.getState().startGame(customInitState)

    const firstAlphabet = alphabet[0]
    const secondAlphabet = alphabet[1]

    // prompt should be the first alphabet in the sequence
    expect(store.getState()?.currentStep?.prompt).toEqual(firstAlphabet)

    store.getState().attemptAnswer(firstAlphabet)
    
    const { currentStep, steps } = store.getState()

    expect(currentStep).toBeDefined()
    expect(steps?.length).toBe(1)
    expect(currentStep?.prompt).toEqual(secondAlphabet)
  })

  test('game should end after completing all alphabets in sequence mode', () => {
    store.getState().startGame(customInitState)
    
    const { alphabet } = store.getState()

    if (!alphabet || !alphabet.length) {
      return
    }

    alphabet.forEach((alphabetItem: ThaiAlphabet, index: number) => {
      store.getState().attemptAnswer(alphabetItem)

      const { steps = [], started } = store.getState()

      expect(steps.length).toBe(index + 1)

      // last step
      if (index === alphabet.length - 1) {
        expect(started).toBe(false)
      } else {
        expect(started).toBe(true)
      }
    })

    const { started, finished, steps = [] } = store.getState()

    expect(started).toBe(false)
    expect(finished).toBe(true)
    expect(steps.length).toBe(alphabet.length)
  })

  test('makeNewStep should generate a new step correctly for random mode', () => {
    store = createStore(customRandomInitState)
    store.getState().startGame(customRandomInitState)

    const { currentStep, settings } = store.getState()

    expect(currentStep).toBeDefined()
    expect(currentStep?.options).toHaveLength(settings?.numberOfOptions || 3)
  })

  test('attemptAnswer should handle correct answer in random mode', () => {
    store = createStore(customRandomInitState)
    store.getState().startGame(customRandomInitState)

    const correctAnswer = store.getState()?.currentStep?.options?.find((option: ThaiAlphabet) => option.alphabet === store.getState()?.currentStep?.prompt.alphabet)

    store.getState().attemptAnswer(correctAnswer)

    const { steps } = store.getState()

    expect(steps?.length).toBe(1)
    expect(steps?.[0].correct).toBe(true)
  })

  test('attemptAnswer should handle incorrect answer in random mode', () => {
    store = createStore(customRandomInitState)
    store.getState().startGame(customRandomInitState)

    const incorrectAnswer = getWrongAnswer(store.getState()?.currentStep?.prompt)

    store.getState().attemptAnswer(incorrectAnswer)

    const { steps } = store.getState()

    expect(steps?.length).toBe(1)
    expect(steps?.[0].correct).toBe(false)
  })

  // test points total
  test('points total should be correct for each correct attempt', () => {
    store.getState().startGame(customInitState)

    const { currentStep } = store.getState()

    if (!currentStep) {
      return
    }

    const correctAnswer = currentStep.options?.find((option: ThaiAlphabet) => option.alphabet === currentStep.prompt.alphabet)

    store.getState().attemptAnswer(correctAnswer)

    const { steps, settings, currentStep: currentStep1 } = store.getState()
    const { numberOfOptions = 3 } = settings

    expect(steps?.length).toBe(1)
    expect(steps?.[0].points).toBe(currentStep1?.points)

    if (!currentStep1) {
      throw new Error('currentStep1 is not defined')
    }

    const correctAnswer2 = getCorrectAnswer(currentStep1)

    // Attempt the correct answer again
    store.getState().attemptAnswer(correctAnswer2)

    const { steps: newSteps } = store.getState()

    expect(newSteps?.length).toBe(2)
    
    const recentStepPoints = newSteps?.[1].points

    // points should be the same as the previous step
    expect(recentStepPoints).toBe(numberOfOptions)

    // total points should be the sum of the points of the two steps
    const totalScore = newSteps?.reduce((acc, step) => acc + step.points, 0)

    expect(totalScore).toBe(numberOfOptions * 2)
  })

  // reduce score by 1 for each incorrect attempt
  test('points total should be reduced by 1 for each incorrect attempt', () => {
    store.getState().startGame(customInitState)

    const { currentStep } = store.getState()

    if (!currentStep) {
      return
    }

    const incorrectAnswer = getWrongAnswer(currentStep.prompt)

    store.getState().attemptAnswer(incorrectAnswer)

    const { steps, currentStep: nextCurrentStep } = store.getState()

    expect(steps?.length).toBe(1)
    expect(steps?.[0].points).toBe(0)
    expect(nextCurrentStep?.points).toBe(currentStep.points - 1)
  })
})