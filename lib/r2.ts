import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client (S3 compatible)
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const r2Manager = {
  /**
   * Upload audio file to R2
   */
  async uploadAudio(file: Blob | Buffer, key?: string): Promise<string> {
    // Generate unique key if not provided
    const fileKey =
      key ||
      `tracks/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp3`;

    // Convert Blob to Buffer if needed
    let buffer: Buffer;
    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    // Upload to R2
    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: 'audio/mpeg',
        // Add metadata
        Metadata: {
          'uploaded-at': new Date().toISOString(),
          app: 'wealthwave',
        },
      })
    );

    // Return public URL
    return `${process.env.R2_PUBLIC_URL}/${fileKey}`;
  },

  /**
   * Generate a presigned URL for direct browser upload
   */
  async getPresignedUploadUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: 'audio/mpeg',
    });

    // URL expires in 1 hour
    return await getSignedUrl(R2, command, { expiresIn: 3600 });
  },

  /**
   * Generate a presigned URL for private file access
   */
  async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    // URL expires in 24 hours
    return await getSignedUrl(R2, command, { expiresIn: 86_400 });
  },

  /**
   * Delete a file from R2
   */
  async deleteAudio(key: string): Promise<void> {
    await R2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );
  },

  /**
   * Extract key from URL
   */
  getKeyFromUrl(url: string): string {
    const baseUrl = process.env.R2_PUBLIC_URL!;
    if (url.startsWith(baseUrl)) {
      return url.substring(baseUrl.length + 1); // +1 for the slash
    }
    // Handle full R2 URLs
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  },

  /**
   * Check whether R2 environment is fully configured with non-placeholder values
   */
  isConfigured(): boolean {
    const {
      R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME,
      R2_PUBLIC_URL,
    } = process.env;

    const invalids = new Set([
      'your_cloudflare_account_id',
      'your_r2_access_key',
      'your_r2_access_key_id',
      'your_r2_secret_key',
      'your_bucket_name',
      'https://your-custom-domain.com',
    ]);

    const values = [
      R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME,
      R2_PUBLIC_URL,
    ];

    if (values.some((v) => !v || v.trim() === '')) return false;
    if (values.some((v) => v && invalids.has(v))) return false;
    return true;
  },

  /**
   * Verify access by performing a tiny put/delete cycle.
   */
  async verifyAccess(): Promise<{
    ok: boolean;
    message: string;
    details?: string;
    urlExample?: string;
  }> {
    if (!this.isConfigured()) {
      return { ok: false, message: 'R2 not fully configured' };
    }
    const key = `health/r2-check-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.txt`;
    try {
      await R2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: new Uint8Array(0),
          ContentType: 'text/plain',
        })
      );
      // Clean up
      await R2.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
        })
      );
      const urlExample = `${process.env.R2_PUBLIC_URL}/${key}`;
      return { ok: true, message: 'Put/Delete succeeded', urlExample };
    } catch (e) {
      const err = e as Error & { Code?: string; name?: string };
      return {
        ok: false,
        message: 'Access check failed',
        details: `${err.name || ''} ${'message' in err ? (err as any).message : ''}`.trim(),
      };
    }
  },
};
