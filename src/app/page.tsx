'use client'

import { useRouter } from 'next/navigation'

import type { GameSettings } from './features/MemoryGame/types'

import GameForm from './components/GameForm'
import { defaultInitState } from './features/MemoryGame/memoryGameStore'

const Home = () => {
  const router = useRouter()

  const startGame = (newGameSettings: GameSettings) => {
    console.info(`create game with settings: ${newGameSettings}`)

    const randomGameId = Math.floor(Math.random() * 1000)

    // put new game settings in params
    const params = new URLSearchParams()

    params.append('level', newGameSettings.gameLevel)
    params.append('mode', newGameSettings.gameMode)
    params.append('type', newGameSettings.gameType)
    params.append('language-mode', newGameSettings.languageMode)

    router.push(`/game/${randomGameId}?${params.toString()}`)
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <h2 className='text-xl font-bold'>New Game</h2>

      <GameForm
        onSubmit={startGame}
        defaultValues={defaultInitState.settings}
      />
    </div>
  )
}

export default Home