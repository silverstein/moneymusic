import type { MusicGeneration } from './types';

const SHARE_STORAGE_KEY = 'wealthwave_shared_tracks';

export interface SharedTrack {
  id: string;
  shareId: string;
  title: string;
  prompt: string;
  duration: number;
  createdAt: Date;
  sharedAt: Date;
  playCount: number;
  audioData?: string; // Base64 encoded audio
  audioUrl?: string; // R2 URL for permanent storage
}

export const shareManager = {
  // Generate a unique share ID
  generateShareId: () => {
    return `ww-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create a shareable link
  createShareableLink: async (
    generation: MusicGeneration,
    blob?: Blob,
    r2Url?: string
  ): Promise<string> => {
    const shareId = shareManager.generateShareId();

    let audioData: string | undefined;
    let audioUrl: string | undefined;

    // If we have an R2 URL, use that (permanent storage)
    if (r2Url || generation.audioUrl?.startsWith('http')) {
      audioUrl = r2Url || generation.audioUrl;
      console.log('Using R2 URL for share:', audioUrl);
    } else if (blob) {
      // Fallback to base64 for local/demo storage
      audioData = await blobToBase64(blob);
    }

    const sharedTrack: SharedTrack = {
      id: generation.id,
      shareId,
      title: generation.title || 'WealthWave Track',
      prompt: generation.prompt,
      duration: generation.duration,
      createdAt: generation.createdAt,
      sharedAt: new Date(),
      playCount: 0,
      audioData,
      audioUrl, // Add R2 URL if available
    };

    // Store in localStorage (in production, this would go to a database)
    const stored = localStorage.getItem(SHARE_STORAGE_KEY);
    const shares = stored ? JSON.parse(stored) : {};
    shares[shareId] = sharedTrack;
    localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shares));

    // Return the shareable URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/share/${shareId}`;
  },

  // Get a shared track by ID
  getSharedTrack: (shareId: string): SharedTrack | null => {
    const stored = localStorage.getItem(SHARE_STORAGE_KEY);
    if (!stored) return null;

    const shares = JSON.parse(stored);
    const track = shares[shareId];

    if (track) {
      // Increment play count
      track.playCount = (track.playCount || 0) + 1;
      shares[shareId] = track;
      localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shares));
    }

    return track || null;
  },

  // Get share stats
  getShareStats: (shareId: string) => {
    const track = shareManager.getSharedTrack(shareId);
    if (!track) return null;

    return {
      playCount: track.playCount || 0,
      sharedAt: track.sharedAt,
      title: track.title,
    };
  },
};

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:audio/mpeg;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper function to convert base64 to blob
export function base64ToBlob(base64: string, mimeType = 'audio/mpeg'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
