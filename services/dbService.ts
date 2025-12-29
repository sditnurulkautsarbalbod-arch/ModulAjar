import { GeneratedModule, ModuleFormData } from "../types";

const DB_NAME = 'AiTemanGuruDB';
const DB_VERSION = 1;
const STORE_NAME = 'modules';

export interface SavedModule extends GeneratedModule {
  id: number;
  createdAt: string;
  formData?: ModuleFormData; // Opsional: untuk keperluan regenerate di masa depan
}

// Inisialisasi DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Simpan Modul
export const saveModuleToDB = async (module: GeneratedModule, formData?: any): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const item = {
      ...module,
      createdAt: new Date().toISOString(),
      formData: formData
    };

    const request = store.add(item);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Ambil Semua Riwayat
export const getAllModulesFromDB = async (): Promise<SavedModule[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by newest first
      const results = request.result as SavedModule[];
      resolve(results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Hapus Modul
export const deleteModuleFromDB = async (id: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
