import { GoogleGenAI } from "@google/genai";
import { ModuleFormData, GeneratedModule } from "../types";

// Helper untuk mendapatkan Client AI dengan Key yang dinamis
const getAIClient = () => {
  // Menggunakan process.env.API_KEY sesuai panduan
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan variabel environment API_KEY telah diatur.");
  }

  return new GoogleGenAI({ apiKey });
};

// Format date helper
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const generateModule = async (data: ModuleFormData): Promise<GeneratedModule> => {
  const formattedDate = formatDate(data.date);

  const prompt = `
    Bertindaklah sebagai Konsultan Pendidikan Ahli Kurikulum Merdeka Indonesia (Spesialis SD/SMP/SMA).
    Tugas Anda adalah membuat "Modul Ajar" yang SANGAT LENGKAP, PROFESIONAL, PANJANG, dan SIAP CETAK.
    
    PENTING: 
    1. JANGAN berikan kata pengantar. LANGSUNG mulai output dengan Judul Format Markdown (# Judul).
    2. Gunakan Bahasa Indonesia yang baku, pedagogis, dan menarik.
    3. **Kegiatan Pembelajaran harus SANGAT DETAIL**, langkah demi langkah, jangan hanya poin singkat.
    4. **JANGAN GUNAKAN FORMAT LATEX** untuk simbol matematika (seperti $...$, \\circ, dll). Gunakan simbol Unicode biasa (contoh: tulis 90° bukan $90^\\circ$).
    
    Data Input:
    - Sekolah: ${data.schoolName}
    - Penyusun: ${data.teacherName}
    - Mapel/Fase: ${data.subject} / ${data.gradeLevel}
    - Topik: ${data.topic}
    - Model: ${data.method}
    - Materi/Konteks: ${data.materialDetails}
    - Alokasi: ${data.duration} (${data.meetingCount} Pertemuan)

    INSTRUKSI STRUKTUR OUTPUT (Markdown):

    # MODUL AJAR: ${data.topic.toUpperCase()}

    ## A. INFORMASI UMUM
    ### 1. Identitas Modul
    | Komponen | Keterangan |
    | :--- | :--- |
    | **Nama Penyusun** | ${data.teacherName} |
    | **Nama Sekolah** | ${data.schoolName} |
    | **Tahun Penyusunan** | ${new Date().getFullYear()} |
    | **Jenjang / Kelas** | ${data.gradeLevel} |
    | **Mata Pelajaran** | ${data.subject} |
    | **Alokasi Waktu** | ${data.duration} (${data.meetingCount} Pertemuan) |
    | **Model Pembelajaran** | ${data.method} |

    ### 2. Kompetensi Awal
    (Tuliskan pengetahuan/keterampilan prasyarat yang relevan dengan topik "${data.topic}")

    ### 3. Profil Pelajar Pancasila
    (Pilih 2-3 dimensi yang paling relevan dan jelaskan implementasinya dalam modul ini)
    - **[Dimensi 1]**: ...
    - **[Dimensi 2]**: ...

    ### 4. Sarana dan Prasarana
    (Alat, bahan, media, dan sumber belajar yang dibutuhkan secara spesifik)

    ### 5. Target Peserta Didik
    - Peserta didik reguler/tipikal: umum, tidak ada kesulitan dalam mencerna dan memahami materi ajar.
    - Peserta didik dengan pencapaian tinggi: mencerna dan memahami dengan cepat, mampu mencapai keterampilan berfikir aras tinggi (HOTS).

    ### 6. Model Pembelajaran
    ${data.method}

    ## B. KOMPONEN INTI
    ### 1. Tujuan Pembelajaran
    (Rumuskan tujuan berdasarkan Capaian Pembelajaran (CP) yang sesuai dengan topik)
    1. ...
    2. ...

    ### 2. Pemahaman Bermakna
    (Gagasan utama/manfaat kontekstual yang akan diingat siswa seumur hidup)

    ### 3. Pertanyaan Pemantik
    (3-5 pertanyaan terbuka untuk memicu rasa ingin tahu)

    ### 4. Kegiatan Pembelajaran
    (Rincikan langkah-langkah pembelajaran dalam bentuk TABEL. **INSTRUKSI KHUSUS: Buat deskripsi kegiatan yang PANJANG, NARATIF, dan OPERASIONAL**. Hindari kalimat yang terlalu singkat. Uraikan interaksi guru dan siswa.)
    
    #### Pertemuan 1
    | Tahapan | Deskripsi Kegiatan (Detail & Lengkap) | Alokasi Waktu |
    | :--- | :--- | :--- |
    | **Pendahuluan** | 1. **Orientasi**: Guru membuka pembelajaran dengan salam, berdoa bersama, dan mengecek kehadiran peserta didik.<br/>2. **Apersepsi**: Guru mengaitkan materi pembelajaran yang akan dilakukan dengan pengalaman peserta didik atau materi sebelumnya (Uraikan pertanyaan pemantik yang diajukan).<br/>3. **Motivasi**: Memberikan gambaran tentang manfaat mempelajari pelajaran yang akan dipelajari dalam kehidupan sehari-hari.<br/>4. **Pemberian Acuan**: Menyampaikan tujuan pembelajaran dan mekanisme pelaksanaan pembelajaran sesuai model ${data.method}. | 15 Menit |
    | **Inti** | *(Uraikan sintaks model ${data.method} secara lengkap di sini. Jelaskan bagaimana siswa mengamati, menanya, mengumpulkan informasi, mengasosiasi, dan mengkomunikasikan. Tuliskan secara rinci bagaimana guru memfasilitasi diskusi atau proyek. **Minimal 300 kata untuk bagian ini**)* | ... Menit |
    | **Penutup** | 1. **Kesimpulan**: Peserta didik bersama guru menyimpulkan poin-poin penting materi.<br/>2. **Refleksi**: Guru menanyakan perasaan siswa dan pemahaman mereka terhadap materi.<br/>3. **Umpan Balik**: Guru memberikan apresiasi terhadap kinerja siswa.<br/>4. **Tindak Lanjut**: Memberikan tugas rumah atau informasi materi pertemuan berikutnya.<br/>5. **Penutup**: Doa dan salam penutup. | 15 Menit |

    *(Jika pertemuan > 1, buat tabel terpisah untuk Pertemuan 2 dst dengan detail yang sama panjangnya)*

    ### 5. Asesmen
    - **Asesmen Diagnostik**: (Pertanyaan awal untuk memetakan kemampuan)
    - **Asesmen Formatif**: (Observasi selama kegiatan, LKPD, Diskusi)
    - **Asesmen Sumatif**: (Tes tertulis/Proyek di akhir lingkup materi)

    ### 6. Diferensiasi Pembelajaran
    - **Diferensiasi Konten**: (Contoh: Menyediakan bacaan dengan tingkat kesulitan berbeda)
    - **Diferensiasi Proses**: (Contoh: Pendampingan khusus bagi siswa yang kesulitan)
    - **Diferensiasi Produk**: (Contoh: Siswa bebas memilih bentuk hasil karya)

    ### 7. Pengayaan dan Remedial
    - **Pengayaan**: ...
    - **Remedial**: ...

    ### 8. Refleksi
    - **Refleksi Guru**: ...
    - **Refleksi Peserta Didik**: ...

    ## C. LAMPIRAN
    ### 1. Lembar Kerja Peserta Didik (LKPD)
    (Buatkan draf LKPD yang menarik dan instruktif, sertakan langkah kerja)

    ### 2. Bahan Bacaan Guru dan Peserta Didik
    (Ringkasan materi esensial 3-5 paragraf yang lengkap)

    ### 3. Glosarium
    (Daftar istilah sulit dan artinya)

    ### 4. Daftar Pustaka
    (Contoh referensi yang relevan)

    ### 5. Instrumen Asesmen
    
    **a. Teknik Penilaian**
    - Sikap: Observasi
    - Pengetahuan: Tes Tertulis
    - Keterampilan: Performa/Karya

    **b. Rubrik Penilaian (Contoh)**
    | Kriteria | Skor 4 (Sangat Baik) | Skor 3 (Baik) | Skor 2 (Cukup) | Skor 1 (Perlu Bimbingan) |
    | :--- | :--- | :--- | :--- | :--- |
    | [Kriteria 1] | ... | ... | ... | ... |
    | [Kriteria 2] | ... | ... | ... | ... |

    **c. Soal Evaluasi**
    **(INSTRUKSI: Buatlah MINIMAL 10 Soal Pilihan Ganda dan 5 Soal Uraian HOTS)**
    
    **I. Pilihan Ganda**
    1. ...
    2. ...
    (Lanjutkan hingga nomor 10)
    
    **II. Uraian**
    1. ...
    (Lanjutkan hingga nomor 5)
    
    > **Kunci Jawaban:**
    > **Pilihan Ganda:**
    > 1. ...
    > 2. ...
    > (dst sampai 10)
    >
    > **Uraian:**
    > 1. ...
    > (dst sampai 5)

    ---
    
    <br/><br/>
    
    **${data.city}, ${formattedDate}**
    
    Mengetahui,
    
    | Kepala Sekolah | Guru Mata Pelajaran |
    | :---: | :---: |
    | <br/><br/><br/><br/> | <br/><br/><br/><br/> |
    | **${data.principalName}** | **${data.teacherName}** |
    | ${data.principalIdType}. ${data.principalIdNumber || '-'} | ${data.teacherIdType}. ${data.teacherIdNumber || '-'} |
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        temperature: 0.75, // Sedikit lebih kreatif untuk deskripsi naratif
        topK: 40, 
        topP: 0.95 
      }
    });

    const text = response.text;
    if (!text) throw new Error("Tidak ada respon dari AI.");

    return { title: `Modul Ajar ${data.subject} - ${data.topic}`, content: text };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Custom error message for invalid key
    if (error.message && (error.message.includes("403") || error.message.includes("API key"))) {
      throw new Error("API Key tidak valid atau kuota habis. Pastikan API Key Anda benar.");
    }
    throw new Error("Gagal menghubungi layanan AI. Periksa koneksi atau API Key Anda.");
  }
};

export const reviseModule = async (currentContent: string, instruction: string): Promise<GeneratedModule> => {
    const prompt = `
    Saya memiliki Modul Ajar berikut dalam format Markdown:
    
    ${currentContent}

    ---
    INSTRUKSI REVISI:
    Tolong tulis ulang bagian tertentu dari modul di atas dengan menerapkan perubahan berikut: "${instruction}".
    
    KETENTUAN:
    1. Pertahankan struktur utama (A. Informasi Umum, B. Komponen Inti, C. Lampiran) JANGAN MERUBAH FORMAT UTAMA.
    2. Outputkan kembali SELURUH modul dalam format Markdown yang rapi.
    3. JANGAN GUNAKAN FORMAT LATEX ($...$). Gunakan simbol biasa.
    `;

    try {
        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        
        return {
            title: "Modul Ajar (Revisi)",
            content: response.text || currentContent
        };
    } catch (error) {
         throw new Error("Gagal merevisi modul. Pastikan API Key valid.");
    }
}