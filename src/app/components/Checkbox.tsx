export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className='flex items-center space-x-2'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  )
}

export default Checkbox