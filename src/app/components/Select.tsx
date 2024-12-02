import React from 'react'

export interface SelectOption {
  label: string
  options: { value: string | number, label: string }[]
  value?: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select = ({
  label,
  options,
  value,
  onChange,
}: SelectOption) => {
  return (
    <label className='flex items-center text-gray-700 dark:text-gray-200'>
      <span className='mr-2 text-sm font-medium'>{label}</span>
      <select
        value={value}
        onChange={onChange}
        className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:outline-none'
      >
        {options.map(({ value, label }) => (
          <option
            key={value}
            value={value}
            className='p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'
          >
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Select
