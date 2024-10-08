import Link from 'next/link'

const AppBar = () => {
  return (
    <div className='flex h-10 mb-4'>
      <div className='container mx-auto flex items-center'>
        <Link href='/'>
          <div className='cursor-pointer px-4 py-1 flex items-center rounded-xl hover:bg-gray-100'>
            <h1>JumD.ai</h1>
          </div>
        </Link>

        <div className='flex gap-4 ml-auto'>
          <Link href='/alphabet'>
            <div className='cursor-pointer px-4 py-1 flex items-center rounded-xl hover:bg-gray-100'>
              <h1>Alphabet</h1>
            </div>
          </Link>
            
          <Link href='/'>
            <div className='cursor-pointer px-4 py-1 flex items-center rounded-xl hover:bg-gray-100'>
              <h1>Games</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AppBar