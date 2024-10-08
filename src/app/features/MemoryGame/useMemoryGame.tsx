// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type MemoryGameStore, createMemoryGameStore } from './memoryGameStore'

export type MemoryGameApi = ReturnType<typeof createMemoryGameStore>

export const MemoryGameContext = createContext<MemoryGameApi | undefined>(
  undefined,
)

export interface MemoryGameProviderProps {
  children: ReactNode
}

export const MemoryGameProvider = ({
  children,
}: MemoryGameProviderProps) => {
  const storeRef = useRef<MemoryGameApi>()
  if (!storeRef.current) {
    storeRef.current = createMemoryGameStore()
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
