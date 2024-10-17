import { Input } from '@/components/ui/input'
import * as React from 'react'
import { cn } from '@/libraries/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const formatMoney = (value: string) => {
  // Remove all non-numeric characters (except periods for decimal points)
  const cleanedValue = value.replace(/[^0-9]/g, '')

  // Format number with commas
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', onChange, defaultValue = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(formatMoney(String(defaultValue)))

    React.useEffect(() => {
      // Set default value on initial render or when defaultValue changes
      setDisplayValue(formatMoney(String(defaultValue)))
    }, [defaultValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      // Remove commas and format the value
      const numericValue = inputValue.replace(/,/g, '')

      // Update the displayed value with commas
      const formattedValue = formatMoney(numericValue)
      setDisplayValue(formattedValue)

      // Pass the numeric value (without commas) to the parent component
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
