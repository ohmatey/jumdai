import { useRouter, useSearchParams } from 'next/navigation'

import { ThaiAlphabetType } from '@/app/types.d'

const ALPHABET_TYPE_KEY = 'type'

const useAlphabetFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTypes = searchParams.getAll(ALPHABET_TYPE_KEY)

  const toggleAlphabetType = (type: ThaiAlphabetType) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Extract current types from the search params
    const currentTypes = newSearchParams.getAll(ALPHABET_TYPE_KEY)
    const typeExists = currentTypes.includes(type)

    if (typeExists) {
      // Remove the type if it already exists
      const updatedTypes = currentTypes.filter((currentType) => currentType !== type)
      
      newSearchParams.delete(ALPHABET_TYPE_KEY)
      updatedTypes.forEach(updatedType => newSearchParams.append(ALPHABET_TYPE_KEY, updatedType))
    } else {
      // Add the new type to the query params
      newSearchParams.append(ALPHABET_TYPE_KEY, type)
    }

    // Remove the query parameter entirely if there are no types
    if (newSearchParams.getAll(ALPHABET_TYPE_KEY).length === 0) {
      newSearchParams.delete(ALPHABET_TYPE_KEY)
    }

    // Push the updated URL
    router.push(`?${newSearchParams.toString()}`)
  }

  const filters = {
    types: {
      consonant: currentTypes.includes(ThaiAlphabetType.Consonant),
      vowel: currentTypes.includes(ThaiAlphabetType.Vowel),
      tone: currentTypes.includes(ThaiAlphabetType.Tone),
    }
  }

  return {
    filters,
    toggleAlphabetType,
  }
}

export default useAlphabetFilters