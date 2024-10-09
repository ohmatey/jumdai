'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type GameState } from './types'
import { type MemoryGameStore, createMemoryGameStore } from './memoryGameStore'

export type MemoryGameApi = ReturnType<typeof createMemoryGameStore>

export const MemoryGameContext = createContext<MemoryGameApi | undefined>(
  undefined,
)

export interface MemoryGameProviderProps {
  gameState?: GameState
  children: ReactNode
}

export const MemoryGameProvider = ({
  gameState,
  children,
}: MemoryGameProviderProps) => {
  const storeRef = useRef<MemoryGameApi>()
  if (!storeRef.current) {
    storeRef.current = createMemoryGameStore(gameState)
  }

  return (
    <MemoryGameContext.Provider value={storeRef.current}>
      {children}
    </MemoryGameContext.Provider>
  )
}

export const useMemoryGame = <T,>(
  selector: (store: MemoryGameStore) => T,
): T => {
  const counterStoreContext = useContext(MemoryGameContext)

  if (!counterStoreContext) {
    throw new Error('useMemoryGame must be used within MemoryGameProvider')
  }

  return useStore(counterStoreContext, selector)
}
