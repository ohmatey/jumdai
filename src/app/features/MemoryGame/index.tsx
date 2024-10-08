'use client'

import { useEffect } from 'react'

import { useMemoryGame, MemoryGameProvider } from './useMemoryGame'
import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'
import type { GameSettings } from './types'

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

      <div className='flex flex-wrap gap-4 justify-center'>
        {currentStep.options?.map((option, index) => {
          return (
            <button
              key={index}
              onClick={() => attemptAnswer(option)}
              className={'p-4 pb-8 border border-white font-bold text-4xl'}
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
    <div className='flex flex-col items-center my-10'>
      <p className='text-4xl font-bold mb-4'>{steps.reduce((acc, step) => acc + (step.correct ? 1 : 0), 0)} Points</p>
      <p className='text-2xl font-bold'>{steps.filter((step) => step.correct).length}/{steps.length} Correct Attempts</p>

      <div className='flex flex-col gap-4'>
        <p>{settings.gameType} {settings.gameMode} {settings.gameLevel} {settings.languageMode}</p>
      </div>

      <button
        onClick={endGame}
        className='p-2 border border-white font-bold text-l mt-2'
      >End Game</button>
    </div>
  )
}

const StepHistory = () => {
  const {
    steps = [],
    settings,
  } = useMemoryGame(s => s)

  return (
    <div className='flex flex-wrap gap-4'>
      {steps.map((step, index) => {
        return (
          <div key={index} className={`p-4 border-2 border-white ${step.correct ? 'border-green-500' : ''}`}>
            {settings.languageMode === 'thai' ? (
              <div>
                <p>{step.prompt.alphabet}</p>
                <p>{step.prompt.romanTransliterationPrefix} {step.prompt.romanTransliteration}</p>
              </div>
            ) : (
              <div>
                <p>{step.prompt.romanTransliterationPrefix} {step.prompt.romanTransliteration}</p>
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
  settings?: GameSettings
}

const MemoryGame = () => {
  return (
    <MemoryGameProvider>
      <div className='flex flex-col items-center container mx-auto px-4'>
        <CurrentStep />

        <SettingsBox />

        <div className='overflow-x auto'>
          <StepHistory />
        </div>
      </div>
    </MemoryGameProvider>
  )
}

export default MemoryGame