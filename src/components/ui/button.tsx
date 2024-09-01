import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/libraries/utils'
import { motion } from 'framer-motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        blueCol: 'bg-[#2D3250] text-white hover:bg-[#2D3250]/90',
        blueVin: 'bg-[#424769] text-white hover:bg-[#424769]/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-[#758184] text-white hover:bg-[#758184]/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        greenPastel1: 'bg-[#75A47F] text-white hover:bg-[#75A47F]/90'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <motion.div whileTap={{ scale: 1.01 }}>
        <Comp
          className={cn(buttonVariants({ variant, size, className }), isLoading && 'cursor-not-allowed opacity-75')}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {children}
          {isLoading && (
            <span className='ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-middle'></span>
          )}
        </Comp>
      </motion.div>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
