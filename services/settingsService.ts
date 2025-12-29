// Mengambil URL dari Environment Variable
const APPS_SCRIPT_URL = process.env.VITE_APPS_SCRIPT_URL || "";

export interface NotificationSettings {
  isActive: boolean;
  isBlocking: boolean;
  message: string;
}

export const getSettingsFromCloud = async (): Promise<NotificationSettings | null> => {
  if (!APPS_SCRIPT_URL) {
    console.warn("Apps Script URL belum diset di environment variable (VITE_APPS_SCRIPT_URL)");
    return null;
  }

  try {
    // Tambahkan timestamp untuk menghindari caching browser
    const response = await fetch(`${APPS_SCRIPT_URL}?t=${new Date().getTime()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    
    // Konversi string "TRUE"/"FALSE" dari Google Sheet kembali ke boolean jika perlu
    return {
      isActive: data.isActive === true || data.isActive === "TRUE",
      isBlocking: data.isBlocking === true || data.isBlocking === "TRUE",
      message: data.message || ""
    };
  } catch (error) {
    console.error("Gagal mengambil pengaturan dari cloud:", error);
    return null;
  }
};

export const saveSettingsToCloud = async (settings: NotificationSettings): Promise<boolean> => {
  if (!APPS_SCRIPT_URL) return false;

  try {
    // FIX CORS ISSUE:
    // Browser akan memblokir request POST dengan Content-Type: application/json ke domain berbeda (Google Script).
    // Solusinya: Kirim sebagai text/plain. Google Script tetap bisa memparsingnya via JSON.parse(e.postData.contents).
    // Request ini dianggap "Simple Request" oleh browser sehingga tidak memicu Preflight Check yang biasanya gagal di GAS.
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(settings),
      headers: {
        "Content-Type": "text/plain;charset=utf-8", 
      },
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error("Gagal menyimpan pengaturan ke cloud:", error);
    return false;
  }
};