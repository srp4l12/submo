// app/components/ui/button.tsx
import React from "react";
import { cn } from "app/lib/utils";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary"; // ✅ allow variants
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, onClick, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" ? "bg-black text-white" : "bg-gray-200 text-black",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}