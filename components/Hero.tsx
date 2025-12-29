import React from 'react';
import { Brain, Clock, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-8">
      
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
        Buat Modul Ajar <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
          Dalam Hitungan Detik
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Hemat waktu administrasi Anda. Fokuslah mengajar. Biarkan AI Teman Guru membantu menyusun modul ajar Kurikulum Merdeka yang lengkap dan terstruktur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8 pt-8 border-t border-slate-200">
        <FeatureItem 
          icon={<Brain className="w-6 h-6 text-indigo-500" />}
          title="Cerdas & Kontekstual"
          desc="Menyesuaikan dengan karakteristik siswa dan materi."
        />
        <FeatureItem 
          icon={<Clock className="w-6 h-6 text-brand-500" />}
          title="Efisien Waktu"
          desc="Selesai dalam kurang dari 1 menit."
        />
        <FeatureItem 
          icon={<Award className="w-6 h-6 text-amber-500" />}
          title="Standar Kurikulum"
          desc="Sesuai format Kurikulum Merdeka."
        />
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
    <div className="mb-3 p-3 bg-slate-50 rounded-full">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);