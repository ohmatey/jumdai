'use client'

import { useRouter } from 'next/navigation'

import type { GameSettings } from './features/MemoryGame/types'

import GameForm from './components/GameForm'
import { defaultInitState } from './features/MemoryGame/memoryGameStore'

const Home = () => {
  const router = useRouter()

  const startGame = ({
    gameLevel,
    gameMode,
    gameType,
    languageMode,
    numberOfOptions,
  }: GameSettings) => {
    const randomGameId = Math.floor(Math.random() * 1000)

    // put new game settings in params
    const params = new URLSearchParams()

    params.append('level', gameLevel)
    params.append('mode', gameMode)
    params.append('type', gameType)
    params.append('language-mode', languageMode)

    if (numberOfOptions) {
      params.append('number-options', numberOfOptions.toString())
    }

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