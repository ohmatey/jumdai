import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlphabetErrorBoundary } from './AlphabetErrorBoundary'

import {
  type GameSettings,
  LanguageMode,
} from '@/app/features/MemoryGame/types'
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
  languageMode = LanguageMode.Thai,
  showImage = false,
  showType = false,
  showRomanTransliteration = false,
  showRomanDescription = false,
  showThaiDescription = false
}: AlphabetCardProps) => {
  return (
    <Card className='border-2 border-thai-gold/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full max-w-80 min-h-80 bg-gradient-to-br from-white to-thai-gold-light/30'>
      <CardHeader className='text-center pb-4'>
        {showType && (
          <Badge variant="outline" className="mx-auto mb-2 border-thai-blue text-thai-blue">
            {alphabet.consonantGroup} {alphabet.type}
          </Badge>
        )}
        
        {(alphabet.imageSrc && showImage) && (
          <div className='flex justify-center px-2 mb-4'>
            <AlphabetErrorBoundary componentName='AlphabetImage'>
              <Image
                src={`/thai-alphabet${alphabet.imageSrc}`}
                alt={alphabet.alphabet}
                width={200}
                height={200}
                className='rounded-xl shadow-lg'
              />
            </AlphabetErrorBoundary>
          </div>
        )}
      </CardHeader>
      
      <CardContent className='text-center space-y-4'>
        <div className={`flex justify-center items-center ${showImage ? 'min-h-32' : 'min-h-64'}`}>
          <p className='text-8xl font-bold text-thai-red drop-shadow-sm'>
            {languageMode === 'thai' ? alphabet.alphabet : `${alphabet.romanTransliterationPrefix} ${alphabet.romanTransliteration}`}
          </p>
        </div>
        
        <div className='space-y-3'>
          {showThaiDescription && (
            <p className='text-2xl text-foreground font-medium'>
              {alphabet.thaiExamplePrefix} {alphabet.thaiExampleDescription}
            </p>
          )}
          {showRomanTransliteration && (
            <p className='text-2xl text-thai-blue font-semibold'>
              {alphabet.romanTransliterationPrefix} {alphabet.romanTransliteration}
            </p>
          )}
          {showRomanDescription && (
            <p className='text-xl text-muted-foreground'>
              {alphabet.romanDescription}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AlphabetCard