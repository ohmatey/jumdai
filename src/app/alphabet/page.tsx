import thaiAlphabet from '../utils/thaiAlphabet'
import AlphabetCard from '@/app/modules/alphabet/components/AlphabetCard'

const AlphabetListPage = () => {
  return (
    <div className='container mx-auto p-4'>
      <h1
        className='text-4xl font-bold text-center mb-8'
      >Alphabet List</h1>
      
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {thaiAlphabet.map((item) => (
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
    </div>
  )
}

export default AlphabetListPage