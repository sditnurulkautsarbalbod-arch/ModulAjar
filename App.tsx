import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModuleForm } from './components/ModuleForm';
import { ModuleResult } from './components/ModuleResult';
import { Help } from './components/Help';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationModal } from './components/NotificationModal';
import { History } from './components/History';
import { Footer } from './components/Footer';
import { GeneratedModule } from './types';
import { generateModule, reviseModule } from './services/geminiService';
import { saveModuleToDB, SavedModule } from './services/dbService';
import { getSettingsFromCloud, saveSettingsToCloud, NotificationSettings } from './services/settingsService';
import { Loader2, AlertCircle } from 'lucide-react';

const DEFAULT_NOTIFICATION: NotificationSettings = {
  isActive: false,
  isBlocking: false,
  message: "Selamat datang di AI Teman Guru. Saat ini layanan kami sedang dalam pemeliharaan berkala untuk meningkatkan kualitas. Mohon maaf atas ketidaknyamanan ini."
};

const App: React.FC = () => {
  const [moduleData, setModuleData] = useState<GeneratedModule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'help' | 'admin' | 'history'>('home');
  
  // Notification States
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION);
  const [showNotification, setShowNotification] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load Settings from Cloud (Google Sheet) on mount
  useEffect(() => {
    const loadSettings = async () => {
      // 1. Coba load dari LocalStorage dulu agar cepat (optimistic UI)
      const localSettings = localStorage.getItem('ADMIN_NOTIFICATION_SETTINGS');
      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings);
          setNotificationSettings(parsed);
          if (parsed.isActive) setShowNotification(true);
        } catch (e) {
          console.error("Parse local settings error", e);
        }
      }

      // 2. Fetch update terbaru dari Google Sheet
      const cloudSettings = await getSettingsFromCloud();
      if (cloudSettings) {
        setNotificationSettings(cloudSettings);
        localStorage.setItem('ADMIN_NOTIFICATION_SETTINGS', JSON.stringify(cloudSettings));
        
        // Update visibility logic berdasarkan data terbaru
        if (cloudSettings.isActive) {
           // Jika blocking, paksa tampil
           if (cloudSettings.isBlocking) {
             setShowNotification(true);
           } 
           // Jika tidak blocking, tampilkan hanya jika belum ditutup user di sesi ini (opsional, saat ini kita paksa tampil saat load)
           else {
             setShowNotification(true);
           }
        } else {
           setShowNotification(false);
        }
      }
    };

    loadSettings();
  }, []);

  // Determine if Modal should be visible
  const shouldShowModal = notificationSettings.isActive && showNotification && (
    notificationSettings.isBlocking ? currentView !== 'admin' : currentView === 'home'
  );

  // Handle Admin Update
  const handleUpdateSettings = async (newSettings: NotificationSettings) => {
    setIsSavingSettings(true);
    
    // Optimistic Update (Update UI duluan)
    setNotificationSettings(newSettings);
    if (newSettings.isActive) setShowNotification(true);
    localStorage.setItem('ADMIN_NOTIFICATION_SETTINGS', JSON.stringify(newSettings));

    // Save to Cloud
    const success = await saveSettingsToCloud(newSettings);
    if (!success) {
      alert("Gagal menyimpan ke Google Sheet. Periksa koneksi internet atau URL Script.");
      // Rollback jika perlu, tapi untuk admin dashboard biasanya tidak terlalu fatal
    }
    
    setIsSavingSettings(false);
  };

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateModule(formData);
      setModuleData(result);
      
      // Auto-save to IndexedDB (Caching)
      try {
        await saveModuleToDB(result, formData);
        console.log("Module auto-saved to DB");
      } catch (dbError) {
        console.error("Failed to auto-save", dbError);
      }

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat modul. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevision = async (instruction: string) => {
      if (!moduleData) return;
      
      setIsRevising(true);
      setError(null);
      try {
          const result = await reviseModule(moduleData.content, instruction);
          setModuleData(result);
      } catch (err: any) {
          setError(err.message || "Gagal merevisi modul.");
      } finally {
          setIsRevising(false);
      }
  };

  const handleReset = () => {
    setModuleData(null);
    setError(null);
    setCurrentView('home');
  };

  const handleLoadFromHistory = (module: SavedModule) => {
    setModuleData({
      title: module.title,
      content: module.content
    });
    setCurrentView('home');
  };

  const renderHomeContent = () => {
    if (moduleData) {
      return (
        <ModuleResult 
          moduleData={moduleData} 
          onReset={handleReset} 
          onRevise={handleRevision}
          isRevising={isRevising}
        />
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <Hero />
        
        <div id="generator-form" className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Mulai Buat Modul</h2>
            <p className="text-slate-600">Isi detail pembelajaran di bawah ini dan biarkan AI menyusunnya untuk Anda.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-brand-600 animate-spin relative z-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Sedang Meracik Modul Ajar...</h3>
                <p className="text-slate-500 max-w-md mx-auto">AI kami sedang menganalisis Capaian Pembelajaran dan menyusun kegiatan yang menarik untuk siswa Anda.</p>
              </div>
            </div>
          ) : (
            <ModuleForm onSubmit={handleGenerate} />
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
      switch (currentView) {
          case 'help': return <Help />;
          case 'history': return <History onSelectModule={handleLoadFromHistory} />;
          case 'admin': return (
            <AdminDashboard 
              settings={notificationSettings} 
              onUpdateSettings={handleUpdateSettings} 
              isSaving={isSavingSettings}
            />
          );
          default: return renderHomeContent();
      }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar 
        onReset={handleReset} 
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      {/* Global Notification Modal */}
      <NotificationModal 
        isOpen={shouldShowModal} 
        onClose={() => setShowNotification(false)}
        message={notificationSettings.message}
        isBlocking={notificationSettings.isBlocking}
        onAdminOverride={() => setCurrentView('admin')}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;