import Image from 'next/image'

import type { ThaiAlphabet, GameSettings } from '@/app/types'

export interface AlphabetCardProps {
  alphabet: ThaiAlphabet
  languageMode: GameSettings['languageMode']
}

const AlphabetCard = ({
  alphabet,
  languageMode
}: AlphabetCardProps) => {
  return (
    <div className='my-10 p-10 border-4 border-white text-center rounded-xl shadow-xl'>
      {alphabet.imageSrc && (
        <Image
          src={`/thai-alphabet${alphabet.imageSrc}`}
          alt={alphabet.alphabet}
          width={200}
          height={200}
          className='rounded-xl'
        />
      )}
      
      <p className='text-8xl font-bold'>{languageMode === 'thai' ? alphabet.alphabet : `${alphabet.romanTransliterationPrefix} ${alphabet.romanTransliteration}`}</p>
    </div>
  )
}

export default AlphabetCard