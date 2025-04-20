<script setup lang="ts">
definePageMeta({ layout: "projects" });

const galleryImages = ref<string[]>([]);
const printItems = ref<string[]>(Array(20).fill(""));

const addImageToGallery = (imageUrl: string) => {
  galleryImages.value.push(imageUrl);
};

const updateSlot = (index: number, url: string) => {
  printItems.value[index] = url;
};

const submitProject = () => {
  console.log("Сохраняем проект", {
    images: printItems.value.filter(Boolean),
  });
};
</script>

<template>
  <div class="constructor-page">
    <ConstructorUploader @add-image="addImageToGallery" />

    <main class="workspace">
      <ConstructorItem
        v-for="(img, index) in printItems"
        :key="index"
        :image-url="img"
        :index="index"
        @drop="({ index, url }) => updateSlot(index, url)"
        @edit="() => console.log('Открыть модалку для', index)"
      />
    </main>

    <button class="submit-btn" @click="submitProject">
      Добавить в корзину
    </button>
  </div>
</template>

<style scoped>
.constructor-page {
  display: flex;
}

.workspace {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  margin-left: 200px;
  flex-grow: 1;
  justify-content: center;
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
