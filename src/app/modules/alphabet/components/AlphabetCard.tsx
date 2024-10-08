import Image from 'next/image'

import type { GameSettings } from '@/app/features/MemoryGame/types'
import type { ThaiAlphabet } from '@/app/types'

export interface AlphabetCardProps {
  alphabet: ThaiAlphabet
  languageMode?: GameSettings['languageMode']
  showImage?: boolean
  showType?: boolean
  showRomanTransliteration?: boolean
  showRomanDescription?: boolean
  showThaiDescription?: boolean
}

const AlphabetCard = ({
  alphabet,
  languageMode = 'thai',
  showImage = false,
  showType = false,
  showRomanTransliteration = false,
  showRomanDescription = false,
  showThaiDescription = false
}: AlphabetCardProps) => {
  return (
    <div className='border-4 ml-4 mr-4 mb-4 border-white text-center rounded-xl shadow-md w-full max-w-64 min-h-64'>
      {showType && <p className='text-md mb-2 text-gray-400'>{alphabet.consonantGroup} {alphabet.isConsonant ? 'Consonant' : 'Vowel'}</p>}

      {(alphabet.imageSrc && showImage) && (
        <div className='flex justify-center'>
          <Image
            src={`/thai-alphabet${alphabet.imageSrc}`}
            alt={alphabet.alphabet}
            width={200}
            height={200}
            className='rounded-xl'
          />
        </div>
      )}
      
      <div className={`flex justify-center min-h-${showImage ? '64' : '64'} items-center`}>
        <p className='text-8xl font-bold mb-4'>{languageMode === 'thai' ? alphabet.alphabet : `${alphabet.romanTransliterationPrefix} ${alphabet.romanTransliteration}`}</p>
      </div>
      
      <div>
        <div>
          {showThaiDescription && <p className='text-2xl'>{alphabet.thaiExamplePrefix} {alphabet.thaiExampleDescription}</p>}
          {showRomanTransliteration && <p className='text-2xl mb-4'>{alphabet.romanTransliterationPrefix} {alphabet.romanTransliteration}</p>}
        </div>

        {showRomanDescription && (
          <div>
            <p className='text-xl text-gray-500'>{alphabet.romanDescription}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlphabetCard