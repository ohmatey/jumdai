import {
  type ThaiAlphabet,
} from '@/app/types.d'

import consosants from './consonants'
import vowels from './vowels'

const thaiAlphabet: ThaiAlphabet[] = [
  ...consosants,
  ...vowels,
]

export default thaiAlphabet