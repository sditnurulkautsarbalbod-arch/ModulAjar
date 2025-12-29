import React, { useState, useEffect } from 'react';
import { Key, Save, Trash2, ExternalLink, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const Help: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'removed'>('idle');

  useEffect(() => {
    const currentKey = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
    if (currentKey) {
      setSavedKey(currentKey);
      setApiKey(currentKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('CUSTOM_GEMINI_API_KEY', apiKey.trim());
      setSavedKey(apiKey.trim());
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('CUSTOM_GEMINI_API_KEY');
    setSavedKey(null);
    setApiKey('');
    setStatus('removed');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
          Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">API Key</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Pengaturan API Key dan Solusi Kendala Pembuatan Modul
        </p>
      </div>

      {/* API Key Configuration Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 p-6 border-b border-brand-100 flex items-center gap-3">
          <Key className="text-brand-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Pengaturan Google API Key</h2>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* Information Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800">
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-bold mb-1">Mengapa saya butuh API Key sendiri?</p>
              <p>
                Aplikasi ini menggunakan kuota bersama. Jika Anda mengalami kendala 
                <strong> "Gagal menghubungi AI"</strong> atau <strong>"Limit Quota Exceeded"</strong>, 
                masukkan API Key pribadi Anda dari Google AI Studio (Gratis).
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Tempel API Key Anda di sini (AIzaSy...)"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
              />
              {savedKey && (
                <div className="absolute right-3 top-3 text-green-600 flex items-center gap-1 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  <CheckCircle size={12} />
                  Aktif
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} />
              Simpan API Key
            </button>
            
            {savedKey && (
              <button
                onClick={handleRemove}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-red-200"
              >
                <Trash2 size={18} />
                Hapus & Gunakan Default
              </button>
            )}
          </div>

          {/* Status Feedback */}
          {status === 'success' && (
            <div className="text-green-600 text-sm font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} />
              API Key berhasil disimpan! Aplikasi sekarang menggunakan kunci pribadi Anda.
            </div>
          )}
          {status === 'removed' && (
             <div className="text-slate-600 text-sm font-medium flex items-center gap-2 animate-fade-in">
              <HelpCircle size={16} />
              API Key dihapus. Aplikasi kembali menggunakan kunci default server.
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 mt-2">
             <h3 className="font-bold text-slate-800 mb-3">Cara Mendapatkan API Key (Gratis):</h3>
             <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>Buka halaman <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-bold inline-flex items-center gap-1">Google AI Studio <ExternalLink size={12}/></a>.</li>
                <li>Login menggunakan akun Google (Gmail) Anda.</li>
                <li>Klik tombol <strong>"Create API key"</strong>.</li>
                <li>Pilih Project (atau buat baru) lalu klik <strong>"Create API key in existing project"</strong>.</li>
                <li>Salin kode kunci yang muncul (diawali huruf <code>AIzaSy...</code>).</li>
                <li>Tempel kode tersebut pada kolom di atas dan klik <strong>Simpan</strong>.</li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
