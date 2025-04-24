type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`border rounded bg-white shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
};
