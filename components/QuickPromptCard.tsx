import React from 'react';
import { ArrowRight } from 'lucide-react';

interface QuickPromptCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickPromptCard: React.FC<QuickPromptCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-start text-left p-4 bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-50 rounded-xl transition-all duration-200 ease-in-out w-full h-full"
    >
      <div className="mb-3 p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-grow">{description}</p>
      
      <div className="flex items-center text-xs font-medium text-emerald-600 mt-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
        Ask now <ArrowRight size={14} className="ml-1" />
      </div>
    </button>
  );
};

export default QuickPromptCard;