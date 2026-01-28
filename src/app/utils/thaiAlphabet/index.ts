import {
  type ThaiAlphabet,
} from '@/app/types'

import consosants from './consonants'
import vowels from './vowels'

const thaiAlphabet: ThaiAlphabet[] = [
  ...consosants,
  ...vowels,
]

export default thaiAlphabet