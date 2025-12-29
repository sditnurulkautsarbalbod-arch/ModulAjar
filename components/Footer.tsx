import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto print:hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-1 text-slate-600 mb-2">
          Dibuat untuk Guru Hebat Indonesia
        </p>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} - M. Anshar Gaffar - OPS/Admin SD IT Nurul Kautsar Makassar.
        </p>
      </div>
    </footer>
  );
};