import React from 'react';
import { User, MapPin, Mail, Building2, Quote, Briefcase } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">
          Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Kami</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Mengenal lebih dekat inisiator di balik teknologi AI Teman Guru.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-brand-500 to-indigo-600 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User size={64} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-10 px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">M. Anshar Gaffar</h2>
          <p className="text-brand-600 font-medium mt-1">OPS / Admin Sekolah</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Building2 className="text-brand-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Unit Kerja</p>
                <p className="text-slate-800 font-medium">SD IT Nurul Kautsar Makassar</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Briefcase className="text-brand-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Jabatan</p>
                <p className="text-slate-800 font-medium">OPS / Administrator</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg md:col-span-2">
              <MapPin className="text-brand-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Alamat</p>
                <p className="text-slate-800 font-medium">Jl. Andi Mangerangi No. 47, Kel. Bongaya, Kec. Tamalate, Kota Makassar</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg md:col-span-2">
              <Mail className="text-brand-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</p>
                <p className="text-slate-800 font-medium">sditnurulkautsarbalbod@gmail.com</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Motto Section (AI Generated) */}
      <div className="bg-gradient-to-br from-indigo-900 to-brand-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <Quote className="absolute top-6 left-6 text-white/10 w-24 h-24 transform -scale-x-100" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider mb-2 backdrop-blur-sm">
            MOTTO PENDIDIKAN
          </div>
          <h3 className="text-2xl md:text-3xl font-serif italic leading-relaxed">
            "Teknologi hadir bukan untuk menggantikan peran pendidik, melainkan untuk membebaskan mereka dari belenggu administrasi, sehingga hati dan pikiran guru dapat sepenuhnya tercurah untuk menyalakan api keingintahuan siswa."
          </h3>
          <div className="w-16 h-1 bg-brand-400 mx-auto rounded-full"></div>
          <p className="text-brand-200 text-sm">AI Teman Guru</p>
        </div>
      </div>
    </div>
  );
};
