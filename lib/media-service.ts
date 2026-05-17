import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { getR2Config, getR2PublicUrl, r2Client } from './r2';

const SAFE_FOLDERS = ['events', 'ember', 'taranas', 'articles', 'misc'];

export function normalizeMediaFolder(folder?: string) {
  const trimmed = (folder || 'events').trim().toLowerCase();
  const sanitized = trimmed.replace(/[^a-z0-9/-]/g, '');
  const normalized = sanitized.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
  const cleaned = normalized;
  if (!cleaned) return 'events';
  const root = cleaned.split('/')[0];
  return SAFE_FOLDERS.includes(root) ? cleaned : 'misc';
}

export function buildStoragePath(fileName: string, folder?: string) {
  const safeFolder = normalizeMediaFolder(folder);
  const lastDot = fileName.lastIndexOf('.');
  const extension = lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : '';
  return extension ? `${safeFolder}/${uuidv4()}.${extension}` : `${safeFolder}/${uuidv4()}`;
}

export async function createPresignedUpload(options: {
  fileName: string;
  contentType?: string;
  folder?: string;
}) {
  const { bucketName } = getR2Config();
  if (!bucketName) throw new Error('Bucket name not configured');

  const storagePath = buildStoragePath(options.fileName, options.folder);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: storagePath,
    ContentType: options.contentType || 'application/octet-stream',
  });
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });

  return {
    uploadUrl,
    fileUrl: getR2PublicUrl(storagePath),
    storagePath,
  };
}

export async function deleteFromStorage(storagePath: string) {
  const { bucketName } = getR2Config();
  if (!bucketName) throw new Error('Bucket name not configured');
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
    })
  );
}
