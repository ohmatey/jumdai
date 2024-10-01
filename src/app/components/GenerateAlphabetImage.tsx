'use client'

import { useTransition } from 'react'

import type { ThaiAlphabet } from '../types'
import { generateAlphabetImage } from '../modules/alphabet/actions'

export interface GenerateAlphabetImageProps {
  alphabet: ThaiAlphabet
}

const GenerateAlphabetImage = ({
  alphabet
}: GenerateAlphabetImageProps) => {
  const [isPending, startTransition] = useTransition()

  const handleGenerateAlphabetImage = async () => {
    startTransition(async () => {
      await generateAlphabetImage(alphabet)
    })
  }
  
  return (
    <button onClick={handleGenerateAlphabetImage} disabled={isPending} className={`${isPending ? 'bg-gray-500 text-gray-200' : 'bg-blue-500 text-white cursor'} py-2 px-4  rounded-md`}>
      {isPending ? 'Generating...' : 'Generate Alphabet Image'}
    </button>
  )
}

export default GenerateAlphabetImage