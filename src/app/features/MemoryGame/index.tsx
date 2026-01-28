'use client'

import React, { useEffect, useMemo } from 'react'

import { useMemoryGame, MemoryGameProvider } from './useMemoryGame'
import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'
import LoadingState from './components/LoadingState'
import { AlphabetErrorBoundary } from '@/app/modules/alphabet/components/AlphabetErrorBoundary'
import { defaultInitState, getTotalStepPoints } from './memoryGameStore'
import ValidatedTextInput from './components/ValidatedTextInput'
import {
  type GameState,
  InputMode,
} from './types'
import { type ThaiAlphabet, ThaiAlphabetType } from '@/app/types'

export interface GameInputFormProps {
  onSubmit: (attempt: ThaiAlphabet) => void
  alphabet: ThaiAlphabet[]
  maxLength?: number
}

const GameInputForm = ({
  onSubmit,
  alphabet,
  maxLength = 1,
}: GameInputFormProps) => {
  const handleValidatedSubmit = (answer: string) => {
    // Find the alphabet character that matches the validated input
    const matchedAlphabet = alphabet.find((a) => a.alphabet === answer)
    
    if (matchedAlphabet) {
      onSubmit(matchedAlphabet)
    } else {
      // This shouldn't happen with proper validation, but handle it gracefully
      console.error('No matching alphabet found for:', answer)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <ValidatedTextInput
        onSubmit={handleValidatedSubmit}
        placeholder={`Enter Thai character (max ${maxLength} character${maxLength > 1 ? 's' : ''})`}
        className='p-4 border border-white font-bold text-4xl text-center max-w-32'
      />
      <p className='text-sm text-gray-400 mt-2'>
        Type the Thai character and press Enter or click Submit
      </p>
    </div>
  )
}

const CurrentStep = () => {
  const {
    alphabet,
    started,
    currentStep,
    settings,
    attemptAnswer,
    startGame,
  } = useMemoryGame(s => s)

  const {
    inputMode,
    languageMode,
  } = settings

  const isOptionsMode = inputMode === InputMode.Options
  const isInputMode = inputMode === InputMode.Input

  const isCurrentStepVowel = useMemo(() => {
    return currentStep?.prompt?.type === ThaiAlphabetType.Vowel
  }, [currentStep])

  useEffect(() => {
    if (!started) {
      startGame()
    }
  }, [startGame, started])

  if (!currentStep || !currentStep.prompt) {
    return <LoadingState message='Preparing your game...' />
  }

  return (
    <div className='flex flex-col items-center'>
      <AlphabetErrorBoundary componentName='AlphabetCard'>
        <AlphabetCard alphabet={currentStep.prompt} languageMode={languageMode} />
      </AlphabetErrorBoundary>

      {isInputMode && (
        <div className='flex flex-col items-center mt-12'>
          <GameInputForm
            onSubmit={attemptAnswer}
            alphabet={alphabet}
            maxLength={currentStep.prompt.alphabet.length}
          />
        </div>
      )}

      {isOptionsMode && (
        <div className='flex flex-wrap gap-4 justify-center mt-12' role='group' aria-label='Answer options'>
          {currentStep.options?.map((option, index) => {
            const handleAttempt = () => {
              try {
                attemptAnswer(option)
              } catch (error) {
                console.error('Error attempting answer:', error)
              }
            }

            const optionLabel = settings.languageMode === 'thai'
              ? `${!isCurrentStepVowel ? option?.romanTransliterationPrefix || '' : ''} ${option?.romanTransliteration || ''}`.trim()
              : option?.alphabet

            return (
              <button
                key={option?.alphabet}
                onClick={handleAttempt}
                aria-label={`Select ${optionLabel}`}
                className={'p-4 border border-white font-bold text-4xl'}
              >
                {optionLabel}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface SettingsBoxProps {
  onEndGame?: (gameState: GameState) => void
}

const SettingsBox = ({
  onEndGame,
}: SettingsBoxProps) => {
  const gameState = useMemoryGame(s => s)

  const {
    steps = [],
    endGame,
    settings,
  } = gameState

  const totalPoints = useMemo(() => getTotalStepPoints(steps), [steps])

  const handleEndGame = () => {
    try {
      endGame()
      
      if (onEndGame) {
        onEndGame(gameState)
      }
    } catch (error) {
      console.error('Error ending game:', error)
    }
  }

  return (
    <div className='flex mb-6 justify-between w-full' role='region' aria-label='Game status'>
      <div aria-live='polite' aria-atomic='true'>
        <p className='text-4xl font-bold mb-1'>{totalPoints} Points</p>
        <p>{steps.filter((step) => step.correct).length}/{steps.length + 1} Correct Attempts</p>

        <div className='flex flex-col gap-4'>
          <p>{settings.gameType} {settings.gameMode} {settings.gameLevel} {settings.languageMode}</p>
        </div>
      </div>

      <div>
        <button
          onClick={handleEndGame}
          className='p-2 border font-bold text-l mt-2 border-gray-500'
        >End Game</button>
      </div>
    </div>
  )
}

const StepHistory = () => {
  const {
    steps = [],
    settings,
  } = useMemoryGame(s => s)

  // last 3
  const recentSteps = steps.slice(-3).reverse()

  return (
    <div className='flex flex-col gap-4' role='list' aria-label='Recent attempts'>
      {recentSteps.map((step, index) => {
        const stepKey = `${step.prompt.alphabet}-${step.attempt?.alphabet}-${steps.length - index}`
        return (
          <div key={stepKey} role='listitem' className={`p-4 py-8 text-center border-2 max-w-64 w-full rounded-2xl ${step.correct ? 'border-green-500' : 'border-red-500'} ${index === 0 ? 'opacity-100' : index === 1 ? 'opacity-50' : 'opacity-30'}`}>
            {settings.languageMode === 'thai' ? (
              <div className='flex flex-col items-center'>
                <p className='text-6xl font-bold'>{step.prompt.alphabet}</p>
                <p className='text-2xl text-center'>{step.attempt.romanTransliterationPrefix} {step.attempt.romanTransliteration}</p>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <p className='text-2xl font-bold'>{step.prompt.romanTransliterationPrefix} {step.prompt.romanTransliteration}</p>
                <p className='text-4xl text-center'>{step.attempt?.alphabet}</p>
              </div>
            )}

            <p className='text-2xl font-bold mt-4'>{step.points} Points</p>
          </div>
        )
      })}
    </div>
  )
}

export interface MemoryGameProps {
  gameState: GameState
  onEndGame?: (gameState: GameState) => void
}


// Main MemoryGame component with loading state
const MemoryGameContent = ({
  onEndGame,
}: {
  onEndGame?: (gameState: GameState) => void
}) => {
  const gameState = useMemoryGame(s => s)
  const { started, finished, steps } = gameState

  // Show loading state while game initializes
  if (!started && !finished && (steps?.length || 0) === 0) {
    return (
      <div className='flex flex-col items-center container mx-auto'>
        <SettingsBox onEndGame={onEndGame} />
        <CurrentStep />
        <div className='overflow-x auto mt-12'>
          <StepHistory />
        </div>
      </div>
    )
  }

  // Show game over state
  if (finished) {
    return (
      <div className='flex flex-col items-center container mx-auto'>
        <SettingsBox onEndGame={onEndGame} />
        <div className='flex flex-col items-center p-8 bg-green-50 rounded-lg'>
          <p className='text-4xl font-bold text-green-800 mb-2'>Game Over!</p>
          <p className='text-2xl text-green-700'>You scored {getTotalStepPoints(steps || [])} points</p>
          <p className='text-lg text-gray-600 mt-2'>
            {(steps || []).filter(s => s.correct).length} out of {(steps || []).length} correct
          </p>
        </div>
        <div className='overflow-x auto mt-12'>
          <StepHistory />
        </div>
      </div>
    )
  }

  // Show active game state
  return (
    <div className='flex flex-col items-center container mx-auto'>
      <SettingsBox onEndGame={onEndGame} />
      <CurrentStep />
      <div className='overflow-x auto mt-12'>
        <StepHistory />
      </div>
    </div>
  )
}

const MemoryGame = ({
  gameState = defaultInitState,
  onEndGame,
}: MemoryGameProps) => {
  return (
    <MemoryGameProvider gameState={gameState}>
      <MemoryGameContent onEndGame={onEndGame} />
    </MemoryGameProvider>
  )
}

export default MemoryGame