import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, disabled = false, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-4',
      md: 'w-11 h-6', 
      lg: 'w-14 h-8'
    }
    
    const thumbSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
    
    const translateClasses = {
      sm: checked ? 'translate-x-4' : 'translate-x-0.5',
      md: checked ? 'translate-x-5' : 'translate-x-0.5',
      lg: checked ? 'translate-x-6' : 'translate-x-1'
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          checked ? 'bg-green-600' : 'bg-gray-200',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
            thumbSizeClasses[size],
            translateClasses[size]
          )}
        />
      </button>
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle }