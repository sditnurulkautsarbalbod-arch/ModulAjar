import React, { useState } from 'react';
import { BookOpen, Key, Settings, History, Menu, X, Home } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNavigate: (view: 'home' | 'help' | 'admin' | 'history') => void;
  currentView: 'home' | 'help' | 'admin' | 'history';
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (view: 'home' | 'help' | 'admin' | 'history') => {
    onNavigate(view);
    if (view === 'home') {
      onReset();
    }
    setIsMenuOpen(false);
  };

  const navLinkClass = (view: 'home' | 'help' | 'admin' | 'history') => 
    `text-sm font-medium transition-colors flex items-center gap-2 px-4 py-3 rounded-lg ${
      currentView === view 
        ? 'bg-brand-50 text-brand-600 font-bold' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavigate('home')}
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

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => handleNavigate('home')}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'home' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <Home size={16} className="mb-0.5" />
            Beranda
          </button>
          
          <button 
             onClick={() => handleNavigate('history')}
             className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'history' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <History size={16} className="mb-0.5" />
            Riwayat
          </button>

          <button 
             onClick={() => handleNavigate('help')}
             className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'help' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <Key size={16} className="mb-0.5" />
            API Key
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <button
             onClick={() => handleNavigate('admin')}
             className={`p-2 rounded-full transition-all duration-200 ${currentView === 'admin' ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
             title="Dashboard Admin"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-fade-in z-50">
          <div className="flex flex-col p-4 space-y-2">
            <button 
              onClick={() => handleNavigate('home')}
              className={navLinkClass('home')}
            >
              <Home size={18} />
              Beranda
            </button>
            
            <button 
              onClick={() => handleNavigate('history')}
              className={navLinkClass('history')}
            >
              <History size={18} />
              Riwayat Modul
            </button>
            
            <button 
              onClick={() => handleNavigate('help')}
              className={navLinkClass('help')}
            >
              <Key size={18} />
              Pengaturan API Key
            </button>
            
            <div className="h-px bg-slate-100 my-2"></div>
            
            <button 
              onClick={() => handleNavigate('admin')}
              className={navLinkClass('admin')}
            >
              <Settings size={18} />
              Dashboard Admin
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};