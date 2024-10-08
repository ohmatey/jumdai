import {
  Controller,
  useForm,
} from 'react-hook-form'

import { GameMode, type GameSettings } from '@/app/features/MemoryGame/types.d'

export interface GameFormProps {
  onSubmit: (data: {
    gameType: GameSettings['gameType']
    gameMode: GameSettings['gameMode']
    gameLevel: GameSettings['gameLevel']
    languageMode: GameSettings['languageMode']
  }) => void
  defaultValues: GameSettings
}

const GameForm = ({
  onSubmit,
  defaultValues: {
    gameType = 'alphabet',
    gameMode = GameMode.Random,
    gameLevel = 'easy',
    languageMode = 'thai',
  }
}: GameFormProps) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      gameType,
      languageMode,
      gameMode,
      gameLevel
    }
  })

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