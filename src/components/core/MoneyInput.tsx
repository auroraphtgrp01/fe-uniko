import { Input } from '@/components/ui/input'
import * as React from 'react'
import { cn } from '@/libraries/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const formatMoney = (value: string) => {
  const cleanedValue = value.replace(/[^0-9]/g, '')
  const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return formattedValue
}

const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', onChange, value, defaultValue = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(formatMoney(String(value || defaultValue)))

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatMoney(String(value)))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const numericValue = inputValue.replace(/,/g, '')
      const formattedValue = formatMoney(numericValue)
      setDisplayValue(formattedValue)
      if (onChange) {
        const fakeEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue
          }
        }
        onChange(fakeEvent as React.ChangeEvent<HTMLInputElement>)
      }
    }

    return (
      <Input type={type} value={displayValue} onChange={handleChange} className={cn(className)} ref={ref} {...props} />
    )
  }
)

MoneyInput.displayName = 'MoneyInput'

export { MoneyInput }
