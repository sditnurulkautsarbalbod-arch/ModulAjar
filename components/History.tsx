import React, { useEffect, useState } from 'react';
import { getAllModulesFromDB, deleteModuleFromDB, SavedModule } from '../services/dbService';
import { Clock, Trash2, FileText, ChevronRight, Calendar, Search, History as HistoryIcon } from 'lucide-react';

interface HistoryProps {
  onSelectModule: (module: SavedModule) => void;
}

export const History: React.FC<HistoryProps> = ({ onSelectModule }) => {
  const [modules, setModules] = useState<SavedModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAllModulesFromDB();
      setModules(data);
    } catch (error) {
      console.error("Gagal memuat riwayat", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus modul ini dari riwayat?")) {
      await deleteModuleFromDB(id);
      loadHistory(); // Reload list
    }
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.formData?.topic || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
          Riwayat <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Modul</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Daftar modul ajar yang pernah Anda buat sebelumnya. Tersimpan aman di browser Anda.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau topik..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-10 text-slate-400">Memuat riwayat...</div>
        ) : filteredModules.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <HistoryIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Belum ada riwayat</h3>
              <p className="text-slate-500">Buat modul pertama Anda di halaman Beranda.</p>
           </div>
        ) : (
          filteredModules.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectModule(item)}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(item.createdAt)}
                  </span>
                  {item.formData && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                      {item.formData.subject} - {item.formData.gradeLevel}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                 <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Hapus"
                 >
                    <Trash2 size={18} />
                 </button>
                 <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                    <ChevronRight size={20} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
