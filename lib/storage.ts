import type { MusicGeneration } from './types';

const STORAGE_KEY = 'wealthwave_generations';

export const storageManager = {
  // Save generation metadata to localStorage
  saveGeneration: (generation: MusicGeneration) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let generations = stored ? JSON.parse(stored) : [];

    // Keep the audioUrl if it's an R2 URL (permanent storage)
    // Only remove blob URLs since those are stored in IndexedDB
    const generationToSave = generation.audioUrl?.startsWith('http') 
      ? generation // Keep R2 URL
      : (() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { audioUrl, ...metadata } = generation;
          return metadata;
        })();

    // Add or update generation
    const existingIndex = generations.findIndex(
      (g: MusicGeneration) => g.id === generation.id
    );
    if (existingIndex >= 0) {
      generations[existingIndex] = generationToSave;
    } else {
      generations.unshift(generationToSave);
    }

    // Keep only last 50 generations
    if (generations.length > 50) {
      generations = generations.slice(0, 50);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
  },

  // Get all saved generations
  getGenerations: (): MusicGeneration[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Delete a generation
  deleteGeneration: (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const generations = JSON.parse(stored);
    const filtered = generations.filter((g: MusicGeneration) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Also remove audio from IndexedDB
    indexedDBManager.deleteAudio(id);
  },

  // Clear all generations
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    indexedDBManager.clearAll();
  },
};

// IndexedDB for storing audio blobs
class IndexedDBManager {
  private dbName = 'WealthWaveDB';
  private version = 1;
  private storeName = 'audioFiles';
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async saveAudio(id: string, blob: Blob) {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.put({ id, blob, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAudio(id: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAudio(id: string) {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll() {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBManager = new IndexedDBManager();
