export interface UploadedImageDTO {
  filename: string;
  url: string;
  width: number;
  height: number;
}

export function createUploaderRepository(appFetch: typeof $fetch) {
  return {
    /** POST один файл (FormData) */
    async uploadImage(file: File, projectId: string) {
      const fd = new FormData();
      fd.append("image", file);
      return appFetch<UploadedImageDTO>(
        `/uploader/upload?projectId=${projectId}`,
        {
          method: "POST",
          body: fd,
        }
      );
    },

    /** GET все картинки пользователя */
    async listImages() {
      return appFetch<UploadedImageDTO[]>("/uploader/images");
    },
  };
}
