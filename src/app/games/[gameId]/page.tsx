'use client'

import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { GameSettings } from '@/app/features/MemoryGame/types'
import MemoryGame from '@/app/features/MemoryGame'
import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'
import { parseGameSettingsFromSearchParams, getValidationErrorMessage } from '@/app/utils/validation.utils'
import { gameIdSchema } from '@/app/validations/game.schemas'

const GamePage = () => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameSettings, setGameSettings] = useState<GameSettings>(defaultInitState.settings)

  useEffect(() => {
    // Validate game ID and URL parameters on mount
    try {
      // Validate game ID
      const gameId = gameIdSchema.parse(params.gameId)
      console.info('Starting game with ID:', gameId)

      // Parse and validate game settings from URL
      const settings = parseGameSettingsFromSearchParams(searchParams)
      setGameSettings(settings)
      
      setIsLoading(false)
    } catch (err) {
      console.error('Error initializing game:', err)
      setError(getValidationErrorMessage(err))
      setIsLoading(false)
    }
  }, [params.gameId, searchParams])

  const handleEndGame = () => {
    try {
      // TODO: Save game data to localStorage or API
      console.info('Save game data:', gameSettings)
      router.push('/')
    } catch (err) {
      console.error('Error ending game:', err)
      setError('Failed to save game. Redirecting to home...')
      setTimeout(() => router.push('/'), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <div className='animate-pulse'>
            <div className='h-12 w-48 bg-gray-200 rounded mb-4'></div>
            <div className='h-8 w-32 bg-gray-200 rounded mx-auto'></div>
          </div>
          <p className='text-gray-500 mt-4'>Loading game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md'>
            <h2 className='text-xl font-bold text-red-800 mb-2'>Error</h2>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={() => router.push('/')}
              className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
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
        onEndGame={handleEndGame}
      />
    </div>
  )
}

export default GamePage