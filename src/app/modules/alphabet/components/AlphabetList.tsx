'use client'

import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'
import thaiAlphabet from '../../../utils/thaiAlphabet'
import useAlphabetFilters from '../hooks/useAlphabetFilters'

const AlphabetList = () => {
  const {
    filters: {
      types
    }
  } = useAlphabetFilters()

  const filteredAlphabet = thaiAlphabet.filter((item) => {
    if (!types || (!types.consonant && !types.vowel && !types.tone)) {
      return true
    }
    
    if (types.consonant && item.type === 'consonant') {
      return true
    }

    if (types.vowel && item.type === 'vowel') {
      return true
    }

    if (types.tone && item.type === 'tone') {
      return true
    }

    return false
  })

  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
      {filteredAlphabet.map((item) => (
        <div key={item.alphabet} className='flex justify-center'>
          <AlphabetCard
            alphabet={item}
            showImage
            showType
            showRomanTransliteration
            showRomanDescription
            showThaiDescription
          />
        </div>
      ))}
    </div>
  )
}

export default AlphabetList