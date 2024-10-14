'use client'

import { useRouter } from 'next/navigation'

import type { GameSettings } from '@/app/features/MemoryGame/types'
import GameForm from '@/app/modules/alphabet/components/GameForm'
import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'

const Home = () => {
  const router = useRouter()

  const startGame = ({
    gameLevel,
    gameMode,
    gameType,
    languageMode,
    numberOfOptions,
    inputMode,
    thaiAlphabetTypes,
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

    if (inputMode) {
      params.append('input-mode', inputMode)
    }

    if (thaiAlphabetTypes) {
      thaiAlphabetTypes.forEach((type) => {
        params.append('alphabet-type', type)
      })
    }

    router.push(`/games/${randomGameId}?${params.toString()}`)
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