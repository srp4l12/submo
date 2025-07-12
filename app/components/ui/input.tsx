// app/components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "app/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }