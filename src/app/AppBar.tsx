import Link from 'next/link'

const AppBar = () => {
  return (
    <div className='flex h-16 mb-4'>
      <div className='container mx-auto flex items-center'>
        <Link href='/'>
          <div className='cursor-pointer px-4 py-1 flex items-center rounded-xl hover:bg-gray-800'>
            <h1
              className='text-2xl font-bold'
            >Jumdai</h1>
          </div>
        </Link>

        <div className='flex gap-4 ml-auto'>
          <Link href='/alphabet'>
            <div className='cursor-pointer transition px-4 py-1 flex items-center rounded-xl hover:bg-gray-800'>
              <h1>Alphabet</h1>
            </div>
          </Link>
            
          <Link href='/games/history'>
            <div className='cursor-pointer transition px-4 py-1 flex items-center rounded-xl hover:bg-gray-800'>
              <h1>History</h1>
            </div>
          </Link>

          <Link href='/games/new'>
            <button className='px-4 py-1 transition flex items-center rounded-xl bg-blue-500 text-white hover:bg-blue-600'>
              New Game
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AppBar