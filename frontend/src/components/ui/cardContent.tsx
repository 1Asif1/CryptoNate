import React from 'react';

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
};
