'use client'

import { useRouter } from 'next/navigation'

import type { GameSettings } from '@/app/features/MemoryGame/types'
import GameForm from '@/app/modules/alphabet/components/GameForm'
import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'
import { GAME_ID_MIN, GAME_ID_MAX, GAME_URL_PARAMS } from '@/app/constants/game.constants'

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
    try {
      const randomGameId = Math.floor(Math.random() * (GAME_ID_MAX - GAME_ID_MIN + 1)) + GAME_ID_MIN

      // put new game settings in params
      const params = new URLSearchParams()

      params.append(GAME_URL_PARAMS.LEVEL, gameLevel)
      params.append(GAME_URL_PARAMS.MODE, gameMode)
      params.append(GAME_URL_PARAMS.TYPE, gameType)
      params.append(GAME_URL_PARAMS.LANGUAGE_MODE, languageMode)

      if (numberOfOptions) {
        params.append(GAME_URL_PARAMS.NUMBER_OPTIONS, numberOfOptions.toString())
      }

      if (inputMode) {
        params.append(GAME_URL_PARAMS.INPUT_MODE, inputMode)
      }

      if (thaiAlphabetTypes) {
        thaiAlphabetTypes.forEach((type) => {
          params.append(GAME_URL_PARAMS.ALPHABET_TYPE, type)
        })
      }

      router.push(`/games/${randomGameId}?${params.toString()}`)
    } catch (error) {
      console.error('Error starting game:', error)
      // The error boundary will handle any routing errors
      throw error
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-thai-gold-light via-white to-thai-blue-light'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-thai-red mb-4'>Create New Game</h1>
          <p className='text-xl text-muted-foreground'>
            Configure your Thai alphabet learning experience
          </p>
        </div>

        <GameForm
          onSubmit={startGame}
          defaultValues={defaultInitState.settings}
        />
      </div>
    </div>
  )
}

export default Home