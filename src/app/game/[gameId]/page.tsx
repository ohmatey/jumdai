import MemoryGame from '@/app/features/MemoryGame'

const GamePage = () => {
  return (
    <div className='container mx-auto p-4'>
      <MemoryGame
        // settings={settings}
        // onEndGame={() => setStarted(false)}
      />
    </div>
  )
}

export default GamePage