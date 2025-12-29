export interface ModuleFormData {
  // Identitas Sekolah & Guru
  schoolName: string;
  teacherName: string;
  teacherIdType: string;
  teacherIdNumber: string;

  // Detail Pembelajaran
  subject: string;
  gradeLevel: string;
  semester: string;
  duration: string;
  meetingCount: string;

  // Materi & Metode
  topic: string;
  method: string;
  materialDetails: string;

  // Pengesahan
  city: string;
  date: string;
  principalName: string;
  principalIdType: string;
  principalIdNumber: string;
}

export interface GeneratedModule {
  title: string;
  content: string; // Markdown content
}