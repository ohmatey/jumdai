'use client'

import { useSearchParams } from 'next/navigation'

import type { GameSettings } from '@/app/features/MemoryGame/types'
import MemoryGame from '@/app/features/MemoryGame'
import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'

const GamePage = () => {
  const searchParams = useSearchParams()

  const gameSettings: GameSettings = {
    gameMode: searchParams.get('mode') as GameSettings['gameMode'],
    gameLevel: searchParams.get('level') as GameSettings['gameLevel'],
    gameType: searchParams.get('type') as GameSettings['gameType'],
    languageMode: searchParams.get('languageMode') as GameSettings['languageMode'],
  }

  return (
    <div className='container mx-auto p-4'>
      <MemoryGame
        gameState={{
          ...defaultInitState,
          settings: {
            ...defaultInitState.settings,
            ...gameSettings
          }
        }}
        // onEndGame={() => setStarted(false)}
      />
    </div>
  )
}

export default GamePage