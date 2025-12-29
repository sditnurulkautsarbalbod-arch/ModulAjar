import React from 'react';
import { BookOpen, Key, Settings, History } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNavigate: (view: 'home' | 'help' | 'admin' | 'history') => void;
  currentView: 'home' | 'help' | 'admin' | 'history';
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onNavigate, currentView }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            onNavigate('home');
            onReset();
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform duration-200">
            <BookOpen size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl leading-none text-slate-800 tracking-tight">
              AI Teman Guru
            </span>
            <span className="text-[10px] font-medium text-brand-600 tracking-wider uppercase">
              Teaching Assistant
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            Beranda
          </button>
          
          <button 
             onClick={() => onNavigate('history')}
             className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'history' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <History size={16} />
            Riwayat
          </button>

          <button 
             onClick={() => onNavigate('help')}
             className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'help' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <Key size={16} />
            API Key
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <button
             onClick={() => onNavigate('admin')}
             className={`p-2 rounded-full transition-all duration-200 ${currentView === 'admin' ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
             title="Dashboard Admin"
          >
            <Settings size={20} />
          </button>
        </div>

        <button className="md:hidden text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
};