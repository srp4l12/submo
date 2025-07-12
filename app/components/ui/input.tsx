// components/ui/input.tsx
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-3 py-2 w-full ${props.className ?? ''}`}
    />
  );
};

export default Input;