<template>
  <div
    class="uploader"
    :class="{ 'drag-over': isDragging }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div v-if="!isDragging" class="images-grid">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        class="thumbnail"
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
const emit = defineEmits(["add-image", "select-image"]);
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
</script>

<style scoped>
.uploader {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  padding: 10px;
  background: #fafafa;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  transition: background 0.3s;
}

.uploader.drag-over {
  background: #d1e7ff;
}

.images-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thumbnail {
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  object-fit: cover;
  aspect-ratio: 1/1;
}

.drop-hint {
  text-align: center;
  color: #444;
  font-size: 14px;
  margin-top: 50%;
}
</style>
