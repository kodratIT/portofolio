import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./config";

export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const uploadImage = async (
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const path = `${folder}/${fileName}`;
  return await uploadFile(file, path, onProgress);
};

export const uploadMultipleImages = async (
  files: File[],
  folder: string,
  onProgress?: (index: number, progress: number) => void
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file, folder, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    })
  );
  return await Promise.all(uploadPromises);
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit.");
  }

  return true;
};
