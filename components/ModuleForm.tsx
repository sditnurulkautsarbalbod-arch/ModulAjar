import React, { useState } from 'react';
import { ModuleFormData } from '../types';
import { Send, Book, Calendar, GraduationCap, Users, Target, Building2, User, FileSignature, MapPin, Hash } from 'lucide-react';

interface ModuleFormProps {
  onSubmit: (data: ModuleFormData) => void;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ModuleFormData>({
    schoolName: '',
    teacherName: '',
    teacherIdType: 'NIP',
    teacherIdNumber: '',
    subject: '',
    gradeLevel: '',
    semester: '1 (Ganjil)',
    topic: '',
    duration: '',
    meetingCount: '',
    method: 'Problem Based Learning (PBL)',
    materialDetails: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    principalName: '',
    principalIdType: 'NIP',
    principalIdNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SECTION 1: IDENTITAS SEKOLAH & GURU */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Building2 size={20} />
          <h3 className="font-bold text-lg">Identitas Sekolah & Guru</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Nama Sekolah</label>
            <input
              type="text"
              name="schoolName"
              placeholder="Contoh: SD IT Nurul Kautsar Makassar"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Nama Guru Penyusun</label>
            <input
              type="text"
              name="teacherName"
              placeholder="Contoh: Muhammad Rate, S.Pd"
              value={formData.teacherName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Jenis ID Guru</label>
            <select
              name="teacherIdType"
              value={formData.teacherIdType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="NIY">NIY</option>
              <option value="NUPTK">NUPTK</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nomor Identitas</label>
            <input
              type="text"
              name="teacherIdNumber"
              placeholder="Contoh: 19800101 200501 1 001"
              value={formData.teacherIdNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: INFORMASI PEMBELAJARAN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Book size={20} />
          <h3 className="font-bold text-lg">Detail Pembelajaran</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mata Pelajaran</label>
            <input
              type="text"
              name="subject"
              placeholder="Contoh: IPAS"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fase / Kelas</label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              required
            >
              <option value="">Pilih Kelas</option>
              <option value="Fase A (Kelas 1 SD)">Fase A (Kelas 1 SD)</option>
              <option value="Fase A (Kelas 2 SD)">Fase A (Kelas 2 SD)</option>
              <option value="Fase B (Kelas 3 SD)">Fase B (Kelas 3 SD)</option>
              <option value="Fase B (Kelas 4 SD)">Fase B (Kelas 4 SD)</option>
              <option value="Fase C (Kelas 5 SD)">Fase C (Kelas 5 SD)</option>
              <option value="Fase C (Kelas 6 SD)">Fase C (Kelas 6 SD)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Alokasi Waktu</label>
            <input
              type="text"
              name="duration"
              placeholder="Contoh: 2 x 35 Menit"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Jumlah Pertemuan</label>
            <input
              type="text"
              name="meetingCount"
              placeholder="Contoh: 1"
              value={formData.meetingCount}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="1 (Ganjil)">1 (Ganjil)</option>
              <option value="2 (Genap)">2 (Genap)</option>
            </select>
          </div>

           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Model Pembelajaran</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
              <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
              <option value="Discovery Learning">Discovery Learning</option>
              <option value="Inquiry Learning">Inquiry Learning</option>
              <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
              <option value="Flipped Classroom">Flipped Classroom</option>
              <option value="Gamifikasi (Game Based Learning)">Gamifikasi (Game Based Learning)</option>
              <option value="Blended Learning">Blended Learning</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: MATERI & TOPIK */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Target size={20} />
          <h3 className="font-bold text-lg">Materi & Topik</h3>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Topik Utama</label>
            <input
              type="text"
              name="topic"
              placeholder="Contoh: Bagian Tubuh Tumbuhan"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Detail Materi (Penting)</label>
            <textarea
              name="materialDetails"
              rows={4}
              placeholder="Masukkan poin-poin materi, tujuan khusus, atau karakteristik siswa yang perlu diperhatikan AI..."
              value={formData.materialDetails}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              required
            />
            <p className="text-xs text-slate-500">Semakin detail informasi ini, semakin akurat modul yang dihasilkan.</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: PENGESAHAN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <FileSignature size={20} />
          <h3 className="font-bold text-lg">Pengesahan (Tanda Tangan)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Kota Pengesahan</label>
            <input
              type="text"
              name="city"
              placeholder="Contoh: Makassar"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Nama Kepala Sekolah</label>
            <input
              type="text"
              name="principalName"
              placeholder="Contoh: Kasman, S.Pd.I"
              value={formData.principalName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Jenis ID Kepsek</label>
            <select
              name="principalIdType"
              value={formData.principalIdType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="NIY">NIY</option>
              <option value="NUPTK">NUPTK</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nomor Identitas</label>
            <input
              type="text"
              name="principalIdNumber"
              placeholder="Contoh: 19800101 200501 1 002"
              value={formData.principalIdNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all hover:shadow-brand-300 hover:translate-y-[-2px] flex items-center justify-center gap-3"
        >
          <Send className="w-5 h-5" />
          Generate Modul Ajar
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">
          Modul akan digenerate 100% dari teks ini. Pastikan data sudah benar.
        </p>
      </div>
    </form>
  );
};