import axios from 'axios';

export async function deleteMediaFile(storagePath: string) {
  if (!storagePath) return;
  await axios.post('/api/media', {
    action: 'delete',
    key: storagePath,
  });
}

