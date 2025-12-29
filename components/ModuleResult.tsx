import React, { useState } from 'react';
import { GeneratedModule } from '../types';
import { ArrowLeft, Download, RefreshCw, Sparkles } from 'lucide-react';

interface ModuleResultProps {
  moduleData: GeneratedModule;
  onReset: () => void;
  onRevise?: (instruction: string) => void;
  isRevising?: boolean;
}

export const ModuleResult: React.FC<ModuleResultProps> = ({ moduleData, onReset, onRevise, isRevising = false }) => {
  const [revisionInput, setRevisionInput] = useState('');

  // Fungsi untuk Export ke Word
  const handleExportWord = () => {
    const content = document.getElementById('module-content')?.innerHTML;
    
    // Styling untuk Word (Hardcoded Times New Roman & Black & Line Height 1.15)
    // Update H3 style untuk memiliki border bottom merah
    const preHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${moduleData.title}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.15; 
            color: #000000; 
          }
          .document-header { text-align: center; margin-bottom: 20px; }
          
          /* Heading Styles */
          h1 { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0; color: #000000; text-align: center; }
          .subtitle { font-size: 12pt; margin-top: 5px; font-style: italic; color: #000000; text-align: center; }
          
          h2 { font-size: 14pt; font-weight: bold; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #000000; padding-bottom: 6px; color: #000000; }
          
          /* Heading 3 dengan Garis Merah */
          h3 { font-size: 12pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px; color: #000000; border-bottom: 2px solid #DC2626; padding-bottom: 4px; }
          
          h4 { font-size: 12pt; font-weight: bold; font-style: italic; margin-top: 12px; margin-bottom: 6px; color: #000000; }
          h5 { font-size: 12pt; font-weight: bold; text-decoration: underline; margin-top: 12px; margin-bottom: 6px; color: #000000; }
          
          p { margin-bottom: 10px; text-align: justify; line-height: 1.15; color: #000000; }
          
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; border: 1px solid #000000; }
          th { background-color: #f0f0f0; border: 1px solid #000000; padding: 8px; font-weight: bold; text-align: left; color: #000000; }
          td { border: 1px solid #000000; padding: 8px; vertical-align: top; color: #000000; }
          
          ul, ol { margin-bottom: 10px; padding-left: 25px; color: #000000; }
          li { margin-bottom: 5px; text-align: justify; line-height: 1.15; }
          
          blockquote { background-color: #f9f9f9; border: 1px solid #cccccc; padding: 10px; margin: 10px 0; font-family: 'Times New Roman', serif; font-size: 11pt; color: #000000; }
          strong { font-weight: bold; color: #000000; }
        </style>
      </head>
      <body>
    `;
    const postHtml = "</body></html>";
    
    const html = preHtml + content + postHtml;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    const nav = navigator as any;
    if (nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, `${moduleData.title}.doc`);
    } else {
      downloadLink.href = url;
      downloadLink.download = `${moduleData.title}.doc`;
      downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
  };
  
  const handleRevisionSubmit = () => {
    if (revisionInput.trim() && onRevise) {
        onRevise(revisionInput);
        setRevisionInput('');
    }
  };

  // Custom Parser Markdown -> HTML Elements with LaTeX cleanup
  const parseBold = (text: string) => {
    let formatted = text;

    // 1. Fix LaTeX Degrees: $90^\circ$ -> 90°
    formatted = formatted.replace(/\$(\d+)\^\\circ\$/g, '$1°');
    // Loose LaTeX: 90^\circ -> 90°
    formatted = formatted.replace(/(\d+)\^\\circ/g, '$1°');
    
    // 2. Fix generic LaTeX math delimiters for simple numbers: $180$ -> 180
    formatted = formatted.replace(/\$(\d+)\$/g, '$1');
    
    // 3. Remove standalone LaTeX commands if any left
    formatted = formatted.replace(/\\circ/g, '°');

    // 4. Standard Bold formatting
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return formatted;
  };

  const renderContent = (markdown: string) => {
    let lines = markdown.split('\n');

    // Filter Logic: Hapus teks intro sebelum Header Markdown (#) pertama
    const firstHeaderIndex = lines.findIndex(line => line.trim().startsWith('# '));
    if (firstHeaderIndex !== -1) {
      lines = lines.slice(firstHeaderIndex);
    }

    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let inTable = false;
    let quoteBuffer: string[] = [];
    let inQuote = false;

    // Helper untuk merender buffer quote
    const flushQuote = (buffer: string[], idx: number) => {
        if (buffer.length > 0) {
            elements.push(
                <div key={`quote-${idx}`} className="bg-slate-50 border border-slate-300 rounded p-4 my-4 font-serif text-black">
                    {buffer.map((q, i) => (
                        <div key={i} dangerouslySetInnerHTML={{__html: parseBold(q)}}></div>
                    ))}
                </div>
            );
        }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Deteksi Tabel
      if (line.startsWith('|')) {
        if (inQuote) { flushQuote(quoteBuffer, i); quoteBuffer = []; inQuote = false; }

        inTable = true;
        tableBuffer.push(line);
        if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
          elements.push(renderTable(tableBuffer, `table-${i}`));
          tableBuffer = [];
          inTable = false;
        }
        continue;
      }
      
      // Deteksi Blockquote (Kunci Jawaban)
      if (line.startsWith('>')) {
          inQuote = true;
          quoteBuffer.push(line.replace(/^>\s?/, '')); // Hapus tanda >
          
          if (i === lines.length - 1 || !lines[i+1].trim().startsWith('>')) {
              flushQuote(quoteBuffer, i);
              quoteBuffer = [];
              inQuote = false;
          }
          continue;
      }

      if (line === '') continue;
      
      if (inQuote) { flushQuote(quoteBuffer, i); quoteBuffer = []; inQuote = false; }

      // Render Judul Utama (H1)
      if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        elements.push(
          <div key={`h1-${i}`} className="document-header mb-8 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-black">
              RENCANA PEMBELAJARAN MENDALAM
            </h1>
            <div className="text-lg italic mb-6 text-black subtitle">
              {parseBold(text.replace('Modul Ajar:', '').trim())}
            </div>
            {/* Garis Hitam Tebal */}
            <div className="w-full h-1 bg-black mb-8"></div>
          </div>
        );
        continue;
      }

      // Render Sub-Bab (H2)
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-bold mt-8 mb-4 border-b border-black pb-1 text-black">
            {parseBold(line.replace('## ', ''))}
          </h2>
        );
        continue;
      }

      // Render H3 dengan Garis Merah
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold mt-6 mb-2 text-black border-b-2 border-red-600 pb-2">
            {parseBold(line.replace('### ', ''))}
          </h3>
        );
        continue;
      }
      
      // Render H4
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${i}`} className="text-base font-bold mt-4 mb-2 italic text-black">
            {parseBold(line.replace('#### ', ''))}
          </h4>
        );
        continue;
      }

      // Render H5
      if (line.startsWith('##### ')) {
        elements.push(
          <h5 key={`h5-${i}`} className="text-base font-bold mt-4 mb-2 underline text-black">
            {parseBold(line.replace('##### ', ''))}
          </h5>
        );
        continue;
      }

      if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-6 list-disc mb-1 text-justify leading-[1.15] pl-2 text-black" 
              dangerouslySetInnerHTML={{__html: parseBold(line.replace('- ', ''))}} 
          />
        );
        continue;
      }

      if (/^\d+\./.test(line)) {
        elements.push(
          <div key={`num-${i}`} className="flex gap-2 ml-2 mb-1 text-justify leading-[1.15] text-black">
             <span className="font-bold min-w-[20px]">{line.split('.')[0]}.</span>
             <span dangerouslySetInnerHTML={{__html: parseBold(line.substring(line.indexOf('.') + 1).trim())}}></span>
          </div>
        );
        continue;
      }
      
      if (line === '---') {
        elements.push(<hr key={`hr-${i}`} className="my-8 border-t border-black border-dashed" />);
        continue;
      }

      // Default Paragraph
      elements.push(
        <p key={`p-${i}`} className="mb-3 text-justify leading-[1.15] text-black"
           dangerouslySetInnerHTML={{__html: parseBold(line)}} 
        />
      );
    }
    return elements;
  };

  const renderTable = (lines: string[], keyPrefix: string) => {
    const contentLines = lines.filter(l => !l.includes('---'));
    if (contentLines.length === 0) return null;

    const headers = contentLines[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const rows = contentLines.slice(1).map(line => 
      line.split('|').filter(c => c.trim() !== '').map(c => c.trim())
    );

    return (
      <div key={keyPrefix} className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse border border-black min-w-[600px]">
          <thead>
            <tr className="bg-slate-100 border-b border-black">
              {headers.map((h, idx) => (
                <th key={idx} className="p-2 font-bold border-r border-black last:border-r-0 text-sm uppercase text-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-black last:border-b-0">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 border-r border-black last:border-r-0 text-sm align-top text-black" 
                      dangerouslySetInnerHTML={{__html: parseBold(cell)}} 
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up pb-20">
      {/* CSS untuk Print yang Kuat */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: auto;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, nav, footer, button {
            display: none !important;
          }
          #root {
            width: 100%;
          }
          .print-content {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          #module-content {
            padding: 0 !important;
            width: 100% !important;
            font-family: 'Times New Roman', serif !important;
            font-size: 12pt !important;
            line-height: 1.15 !important;
            color: #000000 !important;
          }
           /* Paksa warna text saat print */
          #module-content h1, #module-content h2, #module-content h4, #module-content h5, #module-content strong, #module-content p, #module-content li, #module-content td {
             color: #000000 !important;
          }
          /* Style khusus H3 di print agar garis merah tetap muncul (atau hitam tergantung preferensi print browser, tapi kita force) */
          #module-content h3 {
             color: #000000 !important;
             border-bottom: 2px solid #DC2626 !important;
             padding-bottom: 4px !important;
          }
          #module-content table, #module-content th, #module-content td {
             border-color: #000000 !important;
          }
          .paper-texture {
            display: none !important;
          }
        }
      `}</style>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print sticky top-20 z-40 bg-slate-50/90 backdrop-blur py-4 border-b border-slate-200 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:border-none md:py-0">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white"
        >
          <ArrowLeft size={20} />
          Buat Baru
        </button>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <button 
            onClick={handleExportWord}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 font-medium text-sm md:text-base group"
          >
            <Download size={18} />
            Download Word
          </button>
        </div>
      </div>

      {/* Document Container */}
      <div className="bg-white rounded shadow-2xl overflow-hidden print-content min-h-[29.7cm] relative">
        {/* Paper Texture/Effect (Hijau - Hanya Hiasan di Web) */}
        <div className="paper-texture absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500 print:hidden"></div>
        
        {/* Konten Utama Dokumen */}
        <div 
            id="module-content" 
            className="p-8 md:p-16 leading-[1.15] max-w-[21cm] mx-auto bg-white transition-all duration-300"
            style={{ 
                fontFamily: "'Times New Roman', serif", 
                fontSize: '12pt',
                color: '#000000',
                lineHeight: '1.15'
            }}
        >
           {renderContent(moduleData.content)}
        </div>
      </div>

      {/* Section Revisi Konten AI */}
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl no-print">
        <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Sparkles size={16} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-800">Revisi Konten AI</h3>
                <p className="text-sm text-slate-500">Kurang puas dengan hasilnya? Berikan instruksi untuk memperbaikinya.</p>
             </div>
        </div>
        
        <textarea 
            value={revisionInput}
            onChange={(e) => setRevisionInput(e.target.value)}
            placeholder="Contoh: Tambahkan soal uraian tentang... atau Ubah rubrik penilaian menjadi lebih detail..."
            className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none mb-4 min-h-[100px] bg-white text-slate-900"
        />
        
        <button 
            onClick={handleRevisionSubmit}
            disabled={isRevising || !revisionInput.trim()}
            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all
                ${isRevising || !revisionInput.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-slate-700 hover:bg-slate-800 shadow-lg shadow-slate-200'}
            `}
        >
            {isRevising ? (
                <>
                  <RefreshCw className="animate-spin w-5 h-5" /> Sedang Merevisi...
                </>
            ) : (
                <>
                   <RefreshCw className="w-5 h-5" /> Tambahkan ke Input & Regenerate
                </>
            )}
        </button>
      </div>
    </div>
  );
}