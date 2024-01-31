// Button.tsx
import "./Button.css"
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string; // Добавленный проп для className
}

const Button: React.FC<ButtonProps> = ({ onClick, className, children }) => (
  <button type="button" className={className} onClick={onClick}>
    {children}
  </button>
);

export default Button;