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
      const guestId = useAuthStore().guestId;
      const fd = new FormData();
      fd.append("image", file);
      return appFetch<UploadedImageDTO>(
        `/uploader/upload?projectId=${projectId}`,
        {
          method: "POST",
          headers: guestId ? { "x-guest-id": guestId } : undefined,
          body: fd,
        }
      );
    },

    /** GET все картинки пользователя */
    async listImages() {
      const guestId = useAuthStore().guestId;
      return appFetch<UploadedImageDTO[]>("/uploader/images", {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
    },
  };
}
