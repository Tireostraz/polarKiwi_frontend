<script setup lang="ts">
import type { PhotoData } from "~/repository/projects";
import { mmToPx } from "#imports";
import type { PhotoLayout } from "~/repository/layouts";

definePageMeta({ layout: "projects" });

const route = useRoute();
const { $api } = useNuxtApp();
const DPI = 300;

const format = computed(() => route.params.format as string);
const { data: photoLayout } = await useAsyncData(`${format}`, () =>
  $api.layouts.getPhotoLayout(format.value)
);
const photosQuantity = ref(photoLayout.value?.quantity || 1);

const photos = ref<PhotoData[]>([]);
const placeholdersData = ref<
  { assignedPhotoIndex: number; layout: PhotoLayout }[]
>(
  Array.from({ length: photosQuantity.value }, () => ({
    assignedPhotoIndex: NaN,
    layout: structuredClone(photoLayout.value!),
  }))
);
const isDraggingFromGallery = ref(false); //для анимации куда можно drag and drop (стили)

const addPhoto = (photoData: PhotoData) => {
  //формирование массива из объектов данных о загруженных фото photo
  photos.value.push(photoData);
};

const cropImageToPlaceholder = (
  image: HTMLImageElement,
  size: { width: number; height: number }
) => {
  const aspectRatio = size.width / size.height;
  const imageRatio = image.width / image.height;

  let newWidth;
  let newHeight;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }
  const x = (image.width - newWidth) / 2;
  const y = (image.height - newHeight) / 2;

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
};

const assignPhotoToPlaceholder = (photoId: string, index: number) => {
  //заполняем пустые ячейки массива индексами печатаемых изображений
  const photoIndex = photos.value.findIndex((photo) => photo.id === photoId);
  if (photoIndex === -1) return;

  const photo = photos.value[photoIndex];
  if (!photo) return;

  const img = new Image();
  img.src = photo.src;
  img.onload = () => {
    const placeholderSize = {
      width: mmToPx(
        photoLayout.value?.size.width! -
          photoLayout.value?.size.left! -
          photoLayout.value?.size.right!,
        DPI
      ),
      height: mmToPx(
        photoLayout.value?.size.height! -
          photoLayout.value?.size.top! -
          photoLayout.value?.size.bottom!,
        DPI
      ),
    };
    const crop = cropImageToPlaceholder(img, placeholderSize);

    const updatedPhoto = { ...photo, crop: crop };
    photos.value[photoIndex] = updatedPhoto;
    placeholdersData.value[index]!.assignedPhotoIndex = photoIndex;
  };
  // По аналогии сделать для авторасстановки фото
  //const firstNaN = placeholdersData.value.findIndex((item) => Number.isNaN(item));
  //placeholdersData.value[firstNaN] = index;
};

/* const handlePhotoUpdate = (updatedPhoto: PhotoData) => {
  const index = photos.value.findIndex((photo) => photo.id === updatedPhoto.id);
  if (index !== -1) {
    photos.value[index] = updatedPhoto;
  }
}; */

// Для модалки
const isModalOpen = ref(false);
const selectedPlaceholder = ref<number | null>(null); //индекс выбранного placeholder - emit
const selectedPhoto = ref<number | null>(null); // индекс выбранного изображения - из массива placeholdersData

function handleSaveEditedImage(newPhotoData: PhotoData, photoIndex: number) {
  console.log(newPhotoData, photoIndex);
  if (newPhotoData) {
    console.log(photos.value[photoIndex]);
    photos.value[photoIndex] = newPhotoData;
  }
  isModalOpen.value = false;
}

function handleDeleteImage() {
  if (selectedPhoto.value !== null) {
    //placeholdersData.value[selectedIndex.value] = "";
  }
  /* isModalOpen.value = false; */
}

function handleOpenModal(index: number) {
  selectedPlaceholder.value = index;
  if (!placeholdersData.value[index] || !selectedPlaceholder.value) return;
  selectedPhoto.value = placeholdersData.value[index].assignedPhotoIndex;

  /* console.log("Emmited index", index);
  console.log(
    "Photo's index",
    placeholdersData.value[index].assignedPhotoIndex
  );
  console.log("Photo", photos.value[selectedPhoto.value]);
  console.log("Layout", placeholdersData.value[index].layout); */

  isModalOpen.value = true;
}

function increasePhotos() {
  photosQuantity.value++;
  placeholdersData.value.push({
    assignedPhotoIndex: NaN,
    layout: structuredClone(photoLayout.value!),
  });
}
function decreasePhotos() {
  if (photosQuantity.value! > photoLayout.value!.quantity) {
    photosQuantity.value--;
    placeholdersData.value.pop();
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
      <EditorUploader
        @add-image="addPhoto"
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
          <EditorPhotoPlaceholder
            v-for="(printItem, index) in placeholdersData"
            :photo="
              Number.isNaN(printItem.assignedPhotoIndex)
                ? undefined
                : photos[printItem.assignedPhotoIndex]
            "
            :template="printItem.layout"
            :is-dragging="isDraggingFromGallery"
            :key="index"
            :index="index"
            @add-photo="assignPhotoToPlaceholder"
            @click="handleOpenModal"
          />
        </div>
      </div>
      <EditorModal
        v-if="isModalOpen && selectedPhoto !== null"
        :photo="photos[selectedPhoto]!"
        :index="placeholdersData[selectedPlaceholder!]!.assignedPhotoIndex"
        :layout="placeholdersData[selectedPlaceholder!]!.layout"
        @save="handleSaveEditedImage"
        @delete="handleDeleteImage"
        @close="isModalOpen = false"
      />

      <button class="submit-btn">Добавить в корзину</button>
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
