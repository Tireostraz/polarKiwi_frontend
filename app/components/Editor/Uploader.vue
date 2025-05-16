<script setup lang="ts">
import type { PhotoData } from "~/repository/projects";

const emit = defineEmits<{
  (e: "drag-start"): void;
  (e: "drag-end"): void;
  (e: "add-image", photoData: PhotoData): void;
}>();
const images = ref<PhotoData[]>([]);
const isDragging = ref(false);
const isGalleryImage = ref(false);

const processFilesSequentially = async (files: FileList | File[]) => {
  for (const file of files) {
    await new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const photo: PhotoData = {
            id: crypto.randomUUID(),
            src: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
            crop: undefined,
            scale: 1,
            rotation: 0,
          };
          images.value.push(photo);
          emit("add-image", photo);
          resolve();
        };
        img.onerror = () => {
          console.error("Ошибка загрузки изображения");
          reject();
        };
      };
      reader.readAsDataURL(file);
    });
  }
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  processFilesSequentially(files);
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;

  if (isGalleryImage.value) {
    isGalleryImage.value = false;
    return;
  }
  const files = e.dataTransfer?.files;
  if (!files) return;

  processFilesSequentially(files);
};

const onDragOver = (e: DragEvent) => {
  isDragging.value = true;
  e.dataTransfer!.dropEffect = isGalleryImage.value ? "none" : "copy";
};

const onDragStart = () => {
  isGalleryImage.value = true;
  emit("drag-start");
};

const handleDragStart = (e: DragEvent, photoId: string) => {
  isGalleryImage.value = true;
  e.dataTransfer?.setData("text/plain", photoId);
  e.dataTransfer!.effectAllowed = "copy";

  const originalImg = e.target as HTMLImageElement;

  const canvas = document.createElement("canvas");
  canvas.width = originalImg.naturalWidth;
  canvas.height = originalImg.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  originalImg.style.opacity = "1";
  ctx.drawImage(originalImg, 0, 0);

  e.dataTransfer!.setDragImage(canvas, canvas.width / 2, canvas.height / 2);

  originalImg.style.opacity = "0.4";
};

const handleDragEnd = (e: DragEvent) => {
  isGalleryImage.value = false;
  (e.target as HTMLElement).style.opacity = "1";
  emit("drag-end");
};
</script>

<template>
  <div
    class="uploader"
    :class="{ 'drag-over': isDragging && !isGalleryImage }"
    @dragover.prevent="onDragOver"
    @dragleave="isDragging = false"
    @drop.prevent="onDrop"
    @dragstart="onDragStart"
  >
    <div class="uploader-tabs">
      <NuxtImg width="24" src="/Constructor/image.svg" />
      <div>Галерея</div>
    </div>
    <div class="uploader-controls">
      <button>+ Загрузить изображения</button>
    </div>
    <div v-if="isDragging && !isGalleryImage" class="drop-hint">
      Перетащите изображения сюда
    </div>
    <div v-else class="images-grid">
      <img
        v-for="(image, index) in images"
        :src="image.src"
        :key="index"
        class="thumbnail"
        draggable="true"
        @dragstart="handleDragStart($event, image.id)"
        @dragend="handleDragEnd"
      />
    </div>
    <input
      type="file"
      accept="image/*"
      multiple
      @change="onFileChange"
      hidden
      ref="fileInput"
    />
  </div>
</template>

<style scoped>
.uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 25;
  flex-shrink: 1;
  flex-basis: 0px;
  bottom: 0px;
  position: relative;
  background-color: white;
  border-right: 1px solid #ddd;
  transition: background 0.3s;
}

.uploader-tabs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.uploader-controls {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
}
.uploader-controls button {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 155px;
  width: 100%;
  height: 36px;
  background: rgb(77, 167, 124);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}
.uploader-controls button:hover {
  transition: all 0.3s;
  background: rgb(57, 121, 90);
}

.uploader.drag-over {
  background: #d1e7ff;
}

.images-grid {
  display: grid;
  overflow-y: auto;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.thumbnail {
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  object-fit: cover;
  aspect-ratio: 1/1;
  transition: transform 0.2s, opacity 0.2s;
}

.thumbnail:active {
  cursor: grabbing;
}

.drop-hint {
  text-align: center;
  color: #444;
  font-size: 14px;
  padding: 40px 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .uploader {
    flex-direction: row;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 10;
    border-top: 1px solid #ddd;
    border-right: none;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .images-grid {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 8px;
    overflow-x: auto;
    flex-grow: 1;
  }

  .thumbnail {
    flex: 0 0 auto;
    width: 80px;
    height: 80px;
  }

  .uploader-controls {
    padding: 0 8px;
    min-width: 140px;
  }

  .uploader-tabs {
    display: none; /* можно скрыть текст на мобильных */
  }
}
</style>
