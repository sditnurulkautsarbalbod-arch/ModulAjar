import React, { useState, useEffect } from 'react';
import { Settings, Bell, Save, CheckCircle, Shield, AlertOctagon, Hammer, Lock, LogIn, LogOut, Cloud, Loader2 } from 'lucide-react';
import { NotificationSettings } from '../services/settingsService';

interface AdminDashboardProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  isSaving: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onUpdateSettings, isSaving }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Settings State
  const [isActive, setIsActive] = useState(settings.isActive);
  const [isBlocking, setIsBlocking] = useState(settings.isBlocking || false);
  const [message, setMessage] = useState(settings.message);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check Session Storage on Mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('ADMIN_SESSION_AUTH');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state if props change (loading from cloud)
  useEffect(() => {
    setIsActive(settings.isActive);
    setIsBlocking(settings.isBlocking || false);
    setMessage(settings.message);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mengambil password dari environment variable, default ke 'admin123' jika tidak ada
    const correctPassword = process.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('ADMIN_SESSION_AUTH', 'true');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    sessionStorage.removeItem('ADMIN_SESSION_AUTH');
  };

  const handleSave = () => {
    const newSettings = { isActive, isBlocking, message };
    onUpdateSettings(newSettings);
    
    if (!isSaving) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-xl">
             <Shield size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Akses Administrator</h1>
          <p className="text-slate-500">Silakan login untuk mengelola aplikasi.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Password Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${loginError ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-slate-300 focus:ring-slate-200'}`}
                  placeholder="Masukkan password..."
                  autoFocus
                />
              </div>
              {loginError && (
                <p className="text-xs text-red-600 font-medium animate-pulse">Password salah. Silakan coba lagi.</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-slate-300"
            >
              <LogIn size={18} />
              Masuk Dashboard
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Area terbatas. Aktivitas Anda mungkin dicatat.
        </p>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-2 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle size={12} />
              Terverifikasi
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Admin</span>
          </h1>
          <p className="text-lg text-slate-600 flex items-center gap-2">
            <Cloud size={18} className="text-brand-500" />
            Terhubung ke Google Sheet
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all self-center md:self-auto"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>

      {/* Notification Control Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700 flex items-center gap-3 text-white">
          <Bell className="text-brand-400" size={24} />
          <div>
            <h2 className="text-xl font-bold">Pengaturan Notifikasi Global</h2>
            <p className="text-slate-400 text-xs">Atur pesan pop-up yang muncul saat pengguna membuka aplikasi.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* Toggle Switch 1: Active Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <label className="font-bold text-slate-800 block">Status Notifikasi</label>
                <p className="text-sm text-slate-500">Aktifkan untuk menampilkan modal di halaman depan.</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Toggle Switch 2: Maintenance Mode (Blocking) */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isActive ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-200 opacity-50 pointer-events-none'}`}>
            <div className="flex items-start gap-3">
                <div className="mt-1 text-amber-600">
                   <Hammer size={20} />
                </div>
                <div>
                    <label className="font-bold text-slate-800 block flex items-center gap-2">
                        Mode Pemeliharaan (Maintenance)
                        {isBlocking && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">BLOCKING</span>}
                    </label>
                    <p className="text-sm text-slate-600 max-w-sm">
                        Jika aktif, modal <strong>tidak bisa ditutup</strong>. Pengunjung tidak bisa mengakses aplikasi. Gunakan saat sedang <em>update</em> sistem.
                    </p>
                </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isBlocking}
                onChange={(e) => setIsBlocking(e.target.checked)}
                disabled={!isActive}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            <label className="block font-bold text-slate-700">
              Isi Pesan {isBlocking ? 'Pemeliharaan' : 'Notifikasi'}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contoh: Mohon maaf, server sedang dalam perbaikan berkala. Silakan kembali dalam 30 menit."
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${isBlocking ? 'border-amber-300 focus:ring-amber-500 bg-amber-50' : 'border-slate-300 focus:ring-brand-500'}`}
            />
            <p className="text-xs text-slate-400 text-right">
              {message.length} karakter
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100">
             <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg 
                ${isSaving 
                  ? 'bg-slate-400 cursor-not-allowed text-white' 
                  : 'bg-slate-800 hover:bg-slate-900 text-white hover:-translate-y-0.5 shadow-slate-200'}`}
            >
              {isSaving ? (
                 <>
                   <Loader2 size={20} className="animate-spin"/> Menyimpan ke Cloud...
                 </>
              ) : showSuccess ? (
                 <>
                   <CheckCircle size={20} className="text-green-400"/> Berhasil Disimpan!
                 </>
              ) : (
                 <>
                   <Save size={20} /> Simpan Perubahan
                 </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-400">Data tersimpan otomatis di Google Sheet (Backend).</p>
          </div>

        </div>
      </div>
    </div>
  );
};