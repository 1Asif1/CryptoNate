import React from 'react';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export const Button = ({ onClick, children, className = '' }: ButtonProps) => {
  return (
    <div className="w-full relative flex justify-center flex-wrap gap-5">
      <button
        onClick={onClick}
        className={`relative border border-indigo-600 group py-1.5 px-10 rounded text-indigo-600 ${className}`}
      >
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full group-hover:transition-all"></span>
        {children}
      </button>
    </div>
  );
};
