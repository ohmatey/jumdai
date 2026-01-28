import { createMemoryGameStore, defaultInitState } from './memoryGameStore'
import { GameMode } from './types'

describe('Memory Game Store - Random Mode', () => {
  test('should end game after 20 questions in random mode', () => {
    const gameState = {
      ...defaultInitState,
      settings: {
        ...defaultInitState.settings,
        gameMode: GameMode.Random,
      }
    }
    
    const store = createMemoryGameStore(gameState)
    const state = store.getState()
    
    // Start the game
    state.startGame(gameState)
    
    // Answer 20 questions (always correct to avoid early game over)
    for (let i = 0; i < 20; i++) {
      const currentState = store.getState()
      
      // If game already finished (shouldn't happen with correct answers), break
      if (currentState.finished) {
        break
      }
      
      expect(currentState.started).toBe(true)
      
      // Find the correct answer to avoid ending game early due to no points
      const correctAnswer = currentState.currentStep?.options?.find(
        option => option.alphabet === currentState.currentStep?.prompt?.alphabet
      )
      
      if (correctAnswer) {
        currentState.attemptAnswer(correctAnswer)
      }
    }
    
    // Game should be finished after 20 questions
    const finalState = store.getState()
    expect(finalState.finished).toBe(true)
    expect(finalState.started).toBe(false)
    expect(finalState.steps.length).toBe(20)
  })
  
  test('should end game when points reach 0', () => {
    const gameState = {
      ...defaultInitState,
      settings: {
        ...defaultInitState.settings,
        gameMode: GameMode.Random,
      }
    }
    
    const store = createMemoryGameStore(gameState)
    const state = store.getState()
    
    // Start the game
    state.startGame(gameState)
    
    // Keep answering incorrectly until no points left
    let attempts = 0
    const maxAttempts = 10 // Prevent infinite loop
    
    while (attempts < maxAttempts) {
      const currentState = store.getState()
      
      if (currentState.finished) {
        break
      }
      
      // Find an incorrect answer
      const incorrectAnswer = currentState.currentStep?.options?.find(
        option => option.alphabet !== currentState.currentStep?.prompt?.alphabet
      )
      
      if (incorrectAnswer) {
        currentState.attemptAnswer(incorrectAnswer)
      }
      
      attempts++
    }
    
    // Game should end when points are depleted
    const finalState = store.getState()
    expect(finalState.finished).toBe(true)
  })
  
  test('should handle empty alphabet gracefully', () => {
    const gameState = {
      ...defaultInitState,
      alphabet: [], // Empty alphabet
      settings: {
        ...defaultInitState.settings,
        gameMode: GameMode.Random,
      }
    }
    
    const store = createMemoryGameStore(gameState)
    const state = store.getState()
    
    // Start the game with empty alphabet
    state.startGame(gameState)
    
    const currentState = store.getState()
    expect(currentState.started).toBe(false)
    expect(currentState.finished).toBe(true)
  })
  
  test('should continue game after correct answer in random mode', () => {
    const gameState = {
      ...defaultInitState,
      settings: {
        ...defaultInitState.settings,
        gameMode: GameMode.Random,
      }
    }
    
    const store = createMemoryGameStore(gameState)
    const state = store.getState()
    
    // Start the game
    state.startGame(gameState)
    
    // Get the correct answer
    const currentState = store.getState()
    const correctAnswer = currentState.currentStep?.options?.find(
      option => option.alphabet === currentState.currentStep?.prompt?.alphabet
    )
    
    if (correctAnswer) {
      currentState.attemptAnswer(correctAnswer)
    }
    
    // Game should continue after correct answer
    const nextState = store.getState()
    expect(nextState.started).toBe(true)
    expect(nextState.finished).toBe(false)
    expect(nextState.steps.length).toBe(1)
    expect(nextState.steps[0].correct).toBe(true)
    expect(nextState.currentStep).toBeTruthy()
  })
})