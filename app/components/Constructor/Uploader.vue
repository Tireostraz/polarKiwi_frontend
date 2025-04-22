<template>
  <div
    class="uploader"
    :class="{ 'drag-over': isDragging }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="uploader-tabs">
      <NuxtImg width="24" src="/Constructor/image.svg" />
      <div>Галерея</div>
    </div>
    <div class="uploader-controls">
      <button>+ Загрузить изображения</button>
    </div>
    <div v-if="!isDragging" class="images-grid">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        class="thumbnail"
        draggable="true"
        @dragstart="handleDragStart($event, img)"
        @dragend="handleDragEnd"
        @click="$emit('select-image', img)"
      />
    </div>
    <div v-else class="drop-hint">Перетащите изображения сюда</div>
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

<script setup lang="ts">
const emit = defineEmits(["add-image", "select-image", "drag-start"]);
const images = ref<string[]>([]);
const isDragging = ref(false);

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  [...files].forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      images.value.push(url);
      emit("add-image", url);
    };
    reader.readAsDataURL(file);
  });
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (!files) return;

  [...files].forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      images.value.push(url);
      emit("add-image", url);
    };
    reader.readAsDataURL(file);
  });
};

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};
const handleDragStart = (e: DragEvent, img: string) => {
  e.dataTransfer?.setData("text/plain", img);
  e.dataTransfer!.effectAllowed = "copyMove";
  (e.target as HTMLElement).style.opacity = "0.4";
  emit("drag-start");
};

const handleDragEnd = (e: DragEvent) => {
  (e.target as HTMLElement).style.opacity = "1";
};
</script>

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
