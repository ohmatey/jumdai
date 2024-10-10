'use client'

import { useEffect, useMemo } from 'react'

import { useMemoryGame, MemoryGameProvider } from './useMemoryGame'
import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'
import { defaultInitState, getTotalStepPoints } from './memoryGameStore'
import type { GameState } from './types'

const CurrentStep = () => {
  const {
    started,
    currentStep,
    settings,
    attemptAnswer,
    startGame,
  } = useMemoryGame(s => s)

  useEffect(() => {
    if (!started) {
      startGame()
    }
    console.log('asd')
  }, [startGame, started])

  if (!currentStep || !currentStep.prompt) {
    return (
      <div className='flex flex-col items-center'>
        Loading..
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center'>
      <AlphabetCard alphabet={currentStep.prompt} languageMode={settings.languageMode} />

      <div className='flex flex-wrap gap-4 justify-center mt-12'>
        {currentStep.options?.map((option, index) => {
          const handleAttempt = () => {
            attemptAnswer(option)
          }

          return (
            <button
              key={index}
              onClick={handleAttempt}
              className={'p-4 border border-white font-bold text-4xl'}
            >
              {settings.languageMode === 'thai' ? `${option?.romanTransliterationPrefix} ${option?.romanTransliteration}` : option?.alphabet}
            </button>
          )
        })}
      </div>
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
    endGame()
    
    if (onEndGame) {
      onEndGame(gameState)
    }
  }

  return (
    <div className='flex mb-6 justify-between w-full'>
      <div>
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
    <div className='flex flex-col gap-4'>
      {recentSteps.map((step, index) => {
        return (
          <div key={index} className={`p-4 py-8 text-center border-2 max-w-64 w-full rounded-2xl ${step.correct ? 'border-green-500' : 'border-red-500'} ${index === 0 ? 'opacity-100' : index === 1 ? 'opacity-50' : 'opacity-30'}`}>
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

const MemoryGame = ({
  gameState = defaultInitState,
  onEndGame,
}: MemoryGameProps) => {
  return (
    <MemoryGameProvider gameState={gameState}>
      <div className='flex flex-col items-center container mx-auto'>
        <SettingsBox onEndGame={onEndGame} />

        <CurrentStep />

        <div className='overflow-x auto mt-12'>
          <StepHistory />
        </div>
      </div>
    </MemoryGameProvider>
  )
}

export default MemoryGame