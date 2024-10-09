'use client'

import { useEffect } from 'react'

import { useMemoryGame, MemoryGameProvider } from './useMemoryGame'
import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'
import { defaultInitState } from './memoryGameStore'
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
          return (
            <button
              key={index}
              onClick={() => attemptAnswer(option)}
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

const SettingsBox = () => {
  const {
    steps = [],
    endGame,
    settings,
  } = useMemoryGame(s => s)

  return (
    <div className='flex mb-6 justify-between w-full'>
      <div>
        <p className='text-4xl font-bold mb-1'>{steps.reduce((acc, step) => acc + (step.correct ? 1 : 0), 0)} Points</p>
        <p>{steps.filter((step) => step.correct).length}/{steps.length + 1} Correct Attempts</p>

        <div className='flex flex-col gap-4'>
          <p>{settings.gameType} {settings.gameMode} {settings.gameLevel} {settings.languageMode}</p>
        </div>
      </div>

      <div>
        <button
          onClick={endGame}
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
          <div key={index} className={`p-4 py-8 border-2 max-w-64 w-full rounded-2xl ${step.correct ? 'border-green-500' : 'border-red-500'} ${index === 0 ? 'opacity-100' : index === 1 ? 'opacity-50' : 'opacity-30'}`}>
            {settings.languageMode === 'thai' ? (
              <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold'>{step.prompt.alphabet}</p>
                <p
                  className='text-2xl text-center'
                >{step.attempt.romanTransliterationPrefix} {step.attempt.romanTransliteration}</p>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold'>{step.prompt.romanTransliterationPrefix} {step.prompt.romanTransliteration}</p>
                <p>{step.attempt?.alphabet}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export interface MemoryGameProps {
  gameState: GameState
}

const MemoryGame = ({
  gameState = defaultInitState
}: MemoryGameProps) => {
  return (
    <MemoryGameProvider gameState={gameState}>
      <div className='flex flex-col items-center container mx-auto'>
        <SettingsBox />

        <CurrentStep />

        <div className='overflow-x auto mt-12'>
          <StepHistory />
        </div>
      </div>
    </MemoryGameProvider>
  )
}

export default MemoryGame