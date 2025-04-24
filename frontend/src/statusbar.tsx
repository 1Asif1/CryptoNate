import { Check, AlertCircle, Info } from 'lucide-react';

type Status = 'success' | 'error' | 'info' | 'none';

interface StatusBarProps {
  status: Status;
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function StatusBar({ status, message, visible, onClose }: StatusBarProps) {
  if (!visible || status === 'none') return null;

  const baseStyle =
    'fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm text-white';

  const statusStyles = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
  };

  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div className={`${baseStyle} ${statusStyles[status] || ''}`}>
      <div className="flex items-center gap-2">
        {icons[status]}
        <span>{message}</span>
      </div>
    </div>
  );
}
