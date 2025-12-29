import React from 'react';
import { X, Bell, Info, AlertTriangle, Hammer, Lock } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isBlocking?: boolean; // New Prop
  onAdminOverride?: () => void; // Untuk masuk admin saat mode maintenance
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  message, 
  isBlocking = false,
  onAdminOverride
}) => {
  if (!isOpen) return null;

  // Helper function to render text with clickable links
  const renderMessageWithLinks = (text: string) => {
    // Regex to capture URLs starting with http:// or https://
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Split the text by the regex (capturing groups are included in the result array)
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // Check if this part is a URL
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-800 underline decoration-brand-300 hover:decoration-brand-800 transition-colors font-medium break-words"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 animate-fade-in ${isBlocking ? 'z-[100]' : 'z-[60]'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity ${isBlocking ? 'bg-slate-900/90 backdrop-blur-md' : 'bg-slate-900/50 backdrop-blur-sm'}`}
        onClick={isBlocking ? undefined : onClose}
      ></div>

      {/* Modal Content */}
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up border ${isBlocking ? 'border-amber-200' : 'border-slate-100'}`}>
        
        {/* Header */}
        <div className={`p-4 flex items-center justify-between text-white ${isBlocking ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-brand-600 to-indigo-600'}`}>
          <div className="flex items-center gap-2 font-bold">
            {isBlocking ? <Hammer className="fill-white/20" size={20} /> : <Bell className="fill-white/20" size={20} />}
            <span>{isBlocking ? 'Sedang Dalam Perbaikan' : 'Pengumuman'}</span>
          </div>
          
          {/* Hide Close button if Blocking */}
          {!isBlocking && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isBlocking ? 'bg-amber-100 text-amber-600' : 'bg-brand-50 text-brand-600'}`}>
                 {isBlocking ? <AlertTriangle size={28} /> : <Info size={24} />}
               </div>
            </div>
            <div className="space-y-2 w-full">
              <h3 className="font-bold text-slate-800 text-lg">
                {isBlocking ? 'Aplikasi Tidak Dapat Diakses' : 'Informasi Penting'}
              </h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base break-words">
                {renderMessageWithLinks(message)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 flex justify-between items-center">
          {/* Admin Backdoor Link (Visible only on blocking to prevent lockout) */}
          {isBlocking ? (
            <button 
              onClick={onAdminOverride}
              className="text-xs text-slate-300 hover:text-slate-500 flex items-center gap-1 transition-colors"
              title="Akses Admin"
            >
              <Lock size={12} /> Admin
            </button>
          ) : (
             <div></div> 
          )}

          {/* Hide 'Saya Mengerti' button if Blocking */}
          {!isBlocking ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Saya Mengerti
            </button>
          ) : (
            <span className="text-xs font-bold text-amber-600 animate-pulse uppercase tracking-wide">
              Mohon Kembali Nanti
            </span>
          )}
        </div>
      </div>
    </div>
  );
};