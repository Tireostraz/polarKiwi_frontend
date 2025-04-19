<script setup lang="ts">
definePageMeta({
  layout: "projects",
});

const galleryImages = ref<string[]>([]);
const printItems = ref<string[]>(Array(20).fill(""));
const activeImageIndex = ref<number | null>(null);
const isEditorOpen = ref(false);

const addImageToGallery = (imageUrl: string) => {
  galleryImages.value.push(imageUrl);
};

const openEditor = (index: number) => {
  activeImageIndex.value = index;
  isEditorOpen.value = true;
};

const closeEditor = () => {
  isEditorOpen.value = false;
  activeImageIndex.value = null;
};

const saveImage = (editData: { zoom: number; rotation: number }) => {
  if (activeImageIndex.value !== null) {
    // Здесь можно применить изменения к изображению
    console.log("Saved edits for image:", editData);
  }
};

const removeImage = () => {
  if (activeImageIndex.value !== null) {
    printItems.value[activeImageIndex.value] = "";
    closeEditor();
  }
};

const replaceImage = () => {
  if (activeImageIndex.value !== null && galleryImages.value.length > 0) {
    // Берем первое изображение из галереи для примера
    printItems.value[activeImageIndex.value] = galleryImages.value[0]!; //добавить провеку на undefined
    closeEditor();
  }
};

const submitProject = () => {
  console.log("Сохраняем проект", {
    images: printItems.value.filter((img) => img),
  });
};
</script>

<template>
  <div class="constructor-page">
    <ConstructorUploader @add-image="addImageToGallery" />

    <main class="polaroid-preview">
      <div class="photos-list">
        <ConstructorItem
          v-for="(img, index) in printItems"
          :key="index"
          :image-url="img"
          :index="index"
          :item-count="printItems.length"
          @edit="openEditor(index)"
        />
      </div>
    </main>

    <ConstructorModal
      v-if="activeImageIndex !== null"
      :is-open="isEditorOpen"
      :image-url="printItems[activeImageIndex] || ''"
      @close="closeEditor"
      @save="saveImage"
      @remove="removeImage"
      @replace="replaceImage"
    />

    <button class="submit-btn" @click="submitProject">
      Добавить в корзину
    </button>
  </div>
</template>

<style scoped>
.constructor-page {
  display: flex;
  gap: 20px;
  padding: 20px;
  position: relative;
}

.polaroid-preview {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.photos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.submit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}
</style>
