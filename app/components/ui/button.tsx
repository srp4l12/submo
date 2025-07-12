// components/ui/button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-black text-white px-4 py-2 rounded ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
};

export default Button;