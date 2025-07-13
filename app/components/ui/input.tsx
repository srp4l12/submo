import * as React from "react";
import { cn } from "app/lib/utils"; // ✅ replace @ with app

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("px-3 py-2 border border-gray-300 rounded w-full", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;