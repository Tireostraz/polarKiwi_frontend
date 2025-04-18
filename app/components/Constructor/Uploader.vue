<template>
  <div class="image-uploader">
    <input
      type="file"
      ref="fileInput"
      multiple
      accept="image/*"
      @change="handleFileChange"
      style="display: none"
    />

    <div
      class="drop-zone"
      @click="triggerFileInput"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      :class="{ 'drag-over': dragOver }"
    >
      <span>Перетащите изображения сюда или кликните для выбора</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["files-uploaded"]);
const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    emit("files-uploaded", Array.from(files));
  }
};

const handleDrop = (e: DragEvent) => {
  dragOver.value = false;
  if (e.dataTransfer?.files) {
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      emit("files-uploaded", files);
    }
  }
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.drop-zone:hover,
.drag-over {
  border-color: #666;
  background-color: #f5f5f5;
}
</style>
