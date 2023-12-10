// Button.tsx
import React from 'react';
import "./Button.css"

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode; // Add this line to include children prop
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button type="button" className="btn-custom" onClick={onClick}>
    {children}
  </button>
);

export default Button;
