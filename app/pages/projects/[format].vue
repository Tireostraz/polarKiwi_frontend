<script setup lang="ts">
definePageMeta({ layout: "projects" });

const route = useRoute();
const { $api } = useNuxtApp();

const format = computed(() => route.params.format as string);
const { data: photoLayout } = await useAsyncData(`${format}`, () =>
  $api.layouts.getPhotoLayout(format.value)
);
const photosQuantity = ref(photoLayout.value?.quantity || 1);

const galleryImages = ref<string[]>([]);
const printItems = ref<string[]>(Array(20).fill(""));
const isDraggingFromGallery = ref(false);

// Для модалки
const isModalOpen = ref(false);
const selectedImage = ref("");
const selectedIndex = ref<number | null>(null);

function handleSaveEditedImage(newSrc: string) {
  if (selectedIndex.value !== null) {
    printItems.value[selectedIndex.value] = newSrc;
  }
  isModalOpen.value = false;
}

function handleDeleteImage() {
  if (selectedIndex.value !== null) {
    printItems.value[selectedIndex.value] = "";
  }
  isModalOpen.value = false;
}

function openEditor(imageUrl: string, index: number) {
  selectedImage.value = imageUrl;
  selectedIndex.value = index;
  isModalOpen.value = true;
}

function deletePhoto() {
  if (selectedIndex.value !== null) {
    printItems.value[selectedIndex.value] = "";
  }
}

function handleUpdateImage({ index, src }: { index: number; src: string }) {
  printItems.value[index] = src;
}

const addImageToGallery = (imageUrl: string) => {
  galleryImages.value.push(imageUrl);
};

const submitProject = () => {
  console.log("Сохраняем проект", {
    images: printItems.value.filter(Boolean),
  });
};

function increasePhotos() {
  photosQuantity.value++;
}
function decreasePhotos() {
  if (photosQuantity.value! > photoLayout.value!.quantity) {
    photosQuantity.value--;
  }
}
function validateInput() {
  const min = photoLayout.value?.quantity || 1;
  if (photosQuantity.value < min) {
    photosQuantity.value = min;
  } else if (photosQuantity.value > 200) {
    photosQuantity.value = 200;
  }
}
</script>

<template>
  <div class="base-editor-layout">
    <client-only>
      <ConstructorUploader
        @add-image="addImageToGallery"
        @drag-start="isDraggingFromGallery = true"
        @drag-end="isDraggingFromGallery = false"
      />

      <div class="workspace">
        <div class="workspace-info">
          <div>Проект: {{ photoLayout?.title }}</div>
          <label>Изображений: </label>
          <input
            type="number"
            v-model="photosQuantity"
            :max="200"
            :min="photoLayout?.quantity"
            @input="validateInput"
          />
          <button @click="increasePhotos">Добавить фото</button>
          <button @click="decreasePhotos">Убрать фото</button>
        </div>
        <div class="workspace-container">
          <ConstructorPhotoItem
            v-for="index in photosQuantity"
            :photo="photoLayout!"
            :is-dragging="isDraggingFromGallery"
            :key="index"
            :index="index - 1"
            :src="printItems[index - 1] || ''"
            @update="handleUpdateImage"
            @click="() => {
              if (printItems[index-1]) {
                openEditor(printItems[index-1]!, index-1)
              }
            }"
          >
          </ConstructorPhotoItem>
        </div>
      </div>
      <ConstructorModal
        v-if="isModalOpen"
        :src="selectedImage"
        @save="handleSaveEditedImage"
        @delete="handleDeleteImage"
        @close="isModalOpen = false"
      />

      <button class="submit-btn" @click="submitProject">
        Добавить в корзину
      </button>
    </client-only>
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
