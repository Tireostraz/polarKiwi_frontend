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
      <div class="workspace-info">
        <div>Проект: title</div>
        <div>Изображений: count</div>
        <button>+</button>
        <button>-</button>
      </div>
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
  height: calc(100vh-56px);
  width: 100%;
  overflow: hidden;
}

.workspace {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 75;
  flex-shrink: 1;
  flex-basis: 0px;
  justify-content: center;
}

.workspace-info {
  display: flex;
  justify-content: space-around;
}

.workspace-container {
  display: flex;
  flex-wrap: wrap;
  padding: 40px 90px 40px 90px;
  overflow-x: hidden;
  overflow-y: auto;
  align-content: flex-start;
  box-sizing: border-box;
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
