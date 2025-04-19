<script setup lang="ts">
import { useStorage } from "@vueuse/core";

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  file?: File;
}

const images: Ref<GalleryImage[]> = ref([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Инициализация хранилища
const storageKey = "gallery-images";
const storage = useStorage<GalleryImage[]>(storageKey, []);

// Загрузка сохранённых изображений при монтировании
onMounted(() => {
  if (storage.value) {
    images.value = storage.value;
  }
});

// Методы (остаются без изменений, кроме сохранения)
const triggerFileInput = (): void => {
  fileInput.value?.click();
};

const handleFiles = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];
  await processFiles(files);
  target.value = "";
};

const dragOver = (): void => {
  isDragging.value = true;
};

const dragLeave = (): void => {
  isDragging.value = false;
};

const handleDrop = async (event: DragEvent): Promise<void> => {
  isDragging.value = false;
  if (!event.dataTransfer) return;

  const files = Array.from(event.dataTransfer.files);
  await processFiles(files);
};

const processFiles = async (files: File[]): Promise<void> => {
  for (const file of files) {
    if (!isValidImage(file)) continue;

    const url = URL.createObjectURL(file);
    const image: GalleryImage = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      url,
      file,
    };

    images.value.push(image);
  }

  // Сохраняем в хранилище
  storage.value = images.value;
};

const removeImage = async (id: string): Promise<void> => {
  images.value = images.value.filter((img) => img.id !== id);
  storage.value = images.value;
};

const isValidImage = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5 МБ

  if (!allowedTypes.includes(file.type)) {
    alert("Допустимы только JPG, PNG и WebP!");
    return false;
  }

  if (file.size > maxSize) {
    alert("Файл слишком большой (макс. 5 МБ)");
    return false;
  }

  return true;
};
</script>

<template>
  <div class="uploader">
    <!-- Кнопка загрузки -->
    <button @click="triggerFileInput" class="upload-button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span>Добавить фото</span>
    </button>

    <!-- Drag-and-drop зона -->
    <div
      class="dropzone"
      @dragover.prevent="dragOver"
      @dragleave="dragLeave"
      @drop.prevent="handleDrop"
      :class="{ 'dropzone--active': isDragging }"
    >
      <div class="dropzone-content">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="32" cy="32" r="31" stroke-opacity="0.25" />
          <path
            d="M32 22v20M22 32h20"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <p>Перетащите фото сюда</p>
      </div>
    </div>

    <!-- Список загруженных изображений -->
    <div class="gallery">
      <div v-for="image in images" :key="image.id" class="gallery-item">
        <img :src="image.url" :alt="image.name" />
        <button @click="removeImage(image.id)" class="remove-button">×</button>
      </div>
    </div>

    <!-- Скрытый input -->
    <input
      type="file"
      ref="fileInput"
      accept="image/jpeg, image/png, image/webp"
      multiple
      @change="handleFiles"
      style="display: none"
    />
  </div>
</template>

<style scoped>
.uploader {
  display: flex;
  z-index: 1000;
  position: fixed;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border-right: 1px solid #eee;
  height: 100vh;
  overflow-y: auto;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.dropzone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.dropzone--active {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.gallery-item {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f44336;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
