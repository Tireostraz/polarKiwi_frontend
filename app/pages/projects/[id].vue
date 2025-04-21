<script setup lang="ts">
definePageMeta({ layout: "projects" });

const galleryImages = ref<string[]>([]);
const printItems = ref<string[]>(Array(20).fill(""));
const isDraggingFromGallery = ref(false);

/* watch(isDraggingFromGallery, (val) => {
  document.body.style.cursor = val ? "no-drop" : "";
}); */

const addImageToGallery = (imageUrl: string) => {
  galleryImages.value.push(imageUrl);
};

const submitProject = () => {
  console.log("Сохраняем проект", {
    images: printItems.value.filter(Boolean),
  });
};
</script>

<template>
  <div class="base-editor-layout">
    <ConstructorUploader
      @add-image="addImageToGallery"
      @drag-start="isDraggingFromGallery = true"
    />

    <div class="workspace">
      <div class="workspace-container">
        <ConstructorItem
          v-for="(img, index) in printItems"
          :image-url="img"
          :key="index"
          :index="index"
        />
      </div>
    </div>

    <button class="submit-btn" @click="submitProject">
      Добавить в корзину
    </button>
  </div>
</template>

<style scoped>
.base-editor-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.workspace {
  display: flex;
  height: 100vh;
  overflow: hidden;
  flex-grow: 75;
  flex-shrink: 1;
  flex-basis: 0px;
  justify-content: center;
}

.workspace-container {
  display: flex;
  flex-wrap: wrap;
  padding: 100px 90px 0px 90px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
  align-content: flex-start;
  gap: 40px;
}

.submit-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #2e7d32;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
</style>
