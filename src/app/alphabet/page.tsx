import Image from 'next/image'

import thaiAlphabet from '../utils/thaiAlphabet'
import GenerateAlphabetImage from '../components/GenerateAlphabetImage'

const AlphabetListPage = () => {
  return (
    <div className='container mx-auto p-4'>
      <h1>Alphabet List</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {thaiAlphabet.map((item) => (
          <div key={item.alphabet} className='p-4 border border-gray-200 rounded-md text-center'>
            <Image
              src={`/thai-alphabet${item.imageSrc}`}
              alt={item.alphabet}
              className='rounded-xl mb-2'
              width={200}
              height={200}
            />
            <p className='text-2xl mb-1'>{item.alphabet} {item.romanTransliterationPrefix} {item.romanTransliteration}</p>
            <p className='text-2xl'>{item.thaiExamplePrefix} {item.thaiExampleDescription}</p>

            <div className='mt-4'>
              <GenerateAlphabetImage alphabet={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlphabetListPage