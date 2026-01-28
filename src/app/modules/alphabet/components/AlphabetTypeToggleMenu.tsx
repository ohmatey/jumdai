'use client'

import { ThaiAlphabetType } from '@/app/types'
import Checkbox from '@/app/components/Checkbox'
import useAlphabetFilters from '../hooks/useAlphabetFilters'

const AlphabetTypeToggleMenu = () => {
  const { toggleAlphabetType, filters } = useAlphabetFilters()

  const {
    types: {
      consonant,
      vowel,
      tone,
    }
  } = filters

  return (
    <div className='flex justify-center'>
      <div className='flex space-x-4'>
        <Checkbox
          label='Consonants'
          checked={consonant}
          onChange={() => toggleAlphabetType(ThaiAlphabetType.Consonant)}
        />

        <Checkbox
          label='Vowels'
          checked={vowel}
          onChange={() => toggleAlphabetType(ThaiAlphabetType.Vowel)}
        />

        <Checkbox
          label='Tones'
          checked={tone}
          onChange={() => toggleAlphabetType(ThaiAlphabetType.Tone)}
        />
      </div>
    </div>
  )
}

export default AlphabetTypeToggleMenu