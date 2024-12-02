import { Suspense } from 'react'
import AlphabetTypeToggleMenu from '@/app/modules/alphabet/components/AlphabetTypeToggleMenu'
import AlphabetList from '@/app/modules/alphabet/components/AlphabetList'

const AlphabetListPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='container mx-auto p-4'>
        <div className='mb-8'>
          <h1
            className='text-4xl font-bold'
          >Alphabet List</h1>

          <AlphabetTypeToggleMenu />
        </div>

        <AlphabetList />
      </div>
    </Suspense>
  )
}

export default AlphabetListPage