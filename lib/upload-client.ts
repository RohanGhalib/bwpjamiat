import axios from "axios";

type DirectUploadOptions = {
  file: File;
  folder?: string;
  onProgress?: (percent: number) => void;
};

type PresignResponse = {
  uploadUrl: string;
  fileUrl: string;
  storagePath: string;
};

export async function uploadFileDirectToR2({
  file,
  folder,
  onProgress,
}: DirectUploadOptions): Promise<PresignResponse> {
  const { data } = await axios.post<PresignResponse>("/api/upload/presign", {
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    folder,
  });

  await axios.put(data.uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total || !onProgress) {
        return;
      }

      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    },
  });

  return data;
}
