import {
  Controller,
  useForm,
} from 'react-hook-form'

import { defaultInitState } from '@/app/features/MemoryGame/memoryGameStore'
import {
  type GameSettings,
  InputMode,
} from '@/app/features/MemoryGame/types.d'
import Checkbox from '@/app/components/Checkbox'
import Select from '@/app/components/Select'
import { ThaiAlphabetType } from '@/app/types.d'

export interface GameFormProps {
  onSubmit: (data: GameSettings) => void
  defaultValues: GameSettings
}

const GameForm = ({
  onSubmit,
  defaultValues = defaultInitState.settings,
}: GameFormProps) => {
  const { handleSubmit, control, watch } = useForm<GameSettings>({
    defaultValues: {
      ...defaultInitState.settings,
      ...defaultValues,
    }
  })

  const gameMode = watch('gameMode')
  const languageMode = watch('languageMode')

  return (
    <form className='flex flex-col gap-4 items-center' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-wrap gap-4'>
        {Object.values(ThaiAlphabetType).map((type) => (
          <Controller
            key={type}
            name='thaiAlphabetTypes'
            control={control}
            defaultValue={defaultValues.thaiAlphabetTypes}
            render={({ field }) => {
              const {
                onChange,
                value,
                ...rest
              } = field

              const isChecked = value.includes(type)

              return (
                <Checkbox
                  {...rest}
                  label={type}
                  checked={isChecked}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      onChange([...value, type])
                    } else {
                      onChange(value.filter((item) => item !== type))
                    }
                  }}
                />
              )
            }}
          />
        ))}
      </div>

      <Controller
        name='gameType'
        control={control}
        render={({ field }) => (
          <Select
            label='Game Type'
            options={[
              { value: 'alphabet', label: 'Alphabet' },
              { value: 'word', label: 'Word' },
            ]}
            {...field}
          />
        )}
      />

      <Controller
        name='languageMode'
        control={control}
        render={({ field }) => (
          <Select
            label='Language Mode'
            options={[
              { value: 'thai', label: 'Thai' },
              { value: 'english', label: 'English' },
            ]}
            {...field}
          />
        )}
      />

      {/* free text input mode checkbox */}
      {languageMode === 'english' && (
        <Controller
          name='inputMode'
          control={control}
          defaultValue={InputMode.Options}
          render={({ field }) => {
            const {
              onChange,
              value,
              ...rest
            } = field

            const isChecked = value === InputMode.Input

            return (
              <label>
                <input
                  type='checkbox'
                  {...rest}
                  checked={isChecked}
                  onChange={(e) => {
                    onChange(e.target.checked ? InputMode.Input : InputMode.Options)
                  }}
                />
                <span className='ml-2'>Free Text Input Mode</span>
              </label>
            )
          }}
        />
      )}

      <Controller
        name='gameMode'
        control={control}
        render={({ field }) => (
          <Select
            label='Game Mode'
            options={[
              { value: 'sequence', label: 'Sequence' },
              { value: 'random', label: 'Random' },
            ]}
            {...field}
          />
        )}
      />

      {gameMode === 'random' && (
        <Controller
          name='numberOfOptions'
          control={control}
          defaultValue={defaultValues.numberOfOptions || 3}
          render={({ field }) => (
            <Select
              label='Number of Options'
              options={[
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
              ]}
              {...field}
            />
          )}
        />
      )}

      <Controller
        name='gameLevel'
        control={control}
        render={({ field }) => (
          <Select
            label='Game Level'
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            {...field}
          />
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