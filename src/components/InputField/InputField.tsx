// components/InputField/InputField.tsx
import React, { ChangeEvent } from 'react';
import "./InputField.css"

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  className: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  className,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
