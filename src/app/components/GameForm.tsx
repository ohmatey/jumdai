import {
  Controller,
  useForm,
} from 'react-hook-form'

import { defaultInitState } from '../features/MemoryGame/memoryGameStore'
import { type GameSettings } from '@/app/features/MemoryGame/types.d'

export interface GameFormProps {
  onSubmit: (data: GameSettings) => void
  defaultValues: GameSettings
}

const GameForm = ({
  onSubmit,
  defaultValues = defaultInitState.settings,
}: GameFormProps) => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues
  })

  const gameMode = watch('gameMode')

  return (
    <form className='flex flex-col gap-4 items-center' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='gameType'
        control={control}
        render={({ field }) => (
          <label>
            <span className='mr-2'>Game Type</span>
            <select {...field}>
              <option value='alphabet'>Alphabet</option>
              <option value='word'>Word</option>
            </select>
          </label>
        )}
      />

      <Controller
        name='languageMode'
        control={control}
        render={({ field }) => (
          <label>
            <span className='mr-2'>Language Mode</span>
            <select {...field}>
              <option value='thai'>Thai</option>
              <option value='english'>English</option>
            </select>
          </label>
        )}
      />

      <Controller
        name='gameMode'
        control={control}
        render={({ field }) => (
          <label>
            <span className='mr-2'>Game Mode</span>
            <select {...field}>
              <option value='random'>Random</option>
              <option value='sequence'>Sequence</option>
            </select>
          </label>
        )}
      />

      {gameMode === 'random' && (
        <Controller
          name='numberOfOptions'
          control={control}
          render={({ field }) => (
            <label>
              <span className='mr-2'>Number of Options</span>
              <select {...field}>
                <option value='3'>3</option>
                <option value='5'>5</option>
                <option value='8'>8</option>
              </select>
            </label>
          )}
        />
      )}

      <Controller
        name='gameLevel'
        control={control}
        render={({ field }) => (
          <label>
            <span className='mr-2'>Game Level</span>
            <select {...field}>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
          </label>
        )}
      />

      <button
        type='submit'
        className='bg-white p-4 border border-black font-bold text-2xl text-black'
      >Start Game</button>
    </form>
  )
}

export default GameForm