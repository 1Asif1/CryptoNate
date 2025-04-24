import React from 'react';

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({ placeholder, value, onChange }: InputProps) => {
  return (
    <div className="flex justify-center">

    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed"
    />
    </div>

  );
};
