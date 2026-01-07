import { LucideIcon } from 'lucide-react';

interface NavigationButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color: 'blue' | 'green' | 'yellow' | 'pink';
}

const colorClasses = {
  blue: 'bg-luquinhas-blue hover:bg-luquinhas-blue-dark',
  green: 'bg-luquinhas-green hover:bg-luquinhas-green-dark',
  yellow: 'bg-luquinhas-yellow hover:bg-luquinhas-yellow-dark text-gray-800',
  pink: 'bg-luquinhas-pink hover:bg-luquinhas-pink-dark'
};

export default function NavigationButton({ icon: Icon, label, onClick, color }: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} text-white font-bold py-6 px-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-4 w-full max-w-md text-xl`}
    >
      <Icon className="w-8 h-8" />
      <span>{label}</span>
    </button>
  );
}
