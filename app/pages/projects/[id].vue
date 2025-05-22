<script setup lang="ts">
import type { PhotoData } from "~/repository/projects";
import { mmToPx } from "#imports";
import type { PhotoLayout } from "~/repository/layouts";

definePageMeta({ layout: "projects" });
const projects = useProjectsStore();

const route = useRoute();
const { $api } = useNuxtApp();
const DPI = 300;

const id = computed(() => route.params.id as string);
const project = computed(() =>
  projects.addedProjects.find((project) => project.id === id.value)
);

// TODO: добавить Critical на await fetch для гарантии получения данных
const { data: photoLayout } = await useAsyncData(
  `${project.value!.format}`,
  () => $api.layouts.getPhotoLayout(project.value!.format)
);

const isDraggingFromGallery = ref(false); //для анимации куда можно drag and drop (стили)
const isAutoPlaceing = ref(false);

project.value?.pages.length;

const addPhoto = (photoData: PhotoData) => {
  //формирование массива из объектов данных о загруженных фото photo
  project.value?.photos.push(photoData);
  if (isAutoPlaceing) {
    const firstEmptyIndex = project.value?.pages.findIndex(
      (page) => page.elements.length === 0
    );
    if (firstEmptyIndex === -1) {
      increasePhotos();
      assignPhotoToPlaceholder(photoData.id, project.value?.pages.length! - 1);
    } else {
      assignPhotoToPlaceholder(photoData.id, firstEmptyIndex!);
    }
  }
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
  const projectValue = project.value;
  if (!projectValue) return;

  console.log(photoId, index);
  console.log(projectValue.photos);

  const photo = projectValue.photos.find((photo) => photo.id === photoId);
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

    const assignedPhoto: PhotoData = {
      ...photo,
      id: crypto.randomUUID(),
      crop,
    };

    const page = projectValue.pages[index];
    if (page) {
      page.elements.push(assignedPhoto);
    } else {
      // если страницы не существует, создаём
      projectValue.pages[index] = {
        id: crypto.randomUUID(),
        layout: structuredClone(photoLayout.value!),
        elements: [assignedPhoto],
        textBlocks: [],
      };
    }
  };
};

// Для модалки
const isModalOpen = ref(false);
const selectedPlaceholder = ref<number | null>(null); //индекс выбранного placeholder - emit

function handleSaveEditedImage(newPhotoData: PhotoData) {
  const projectValue = project.value;
  const index = selectedPlaceholder.value;
  if (projectValue && index !== null) {
    const page = projectValue.pages[index];
    if (page) {
      page.elements[0] = newPhotoData;
    }
  }
  isModalOpen.value = false;
}

function handleDeleteImage() {
  const projectValue = project.value;
  const index = selectedPlaceholder.value;
  if (projectValue && index !== null) {
    const page = projectValue.pages[index];
    if (page) {
      page.elements = [];
    }
  }
  isModalOpen.value = false;
}

function handleOpenModal(index: number) {
  const projectValue = project.value;
  const page = projectValue?.pages[index];
  if (page?.elements.length) {
    selectedPlaceholder.value = index;
    isModalOpen.value = true;
  }
}

function increasePhotos() {
  const projectValue = project.value;
  if (!projectValue) return;

  projectValue.pages.push({
    id: crypto.randomUUID(),
    layout: structuredClone(photoLayout.value!),
    elements: [],
    textBlocks: [],
  });
}
function decreasePhotos() {
  const projectValue = project.value;
  if (!projectValue) return;

  if (projectValue.pages.length > (photoLayout.value?.quantity || 1)) {
    projectValue.pages.pop();
  }
}

function validateInput() {
  /* const min = photoLayout.value?.quantity || 1;
  if (photosQuantity.value < min) {
    photosQuantity.value = min;
  } else if (photosQuantity.value > 200) {
    photosQuantity.value = 200;
  } */
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
          <input type="checkbox" v-model="isAutoPlaceing" />
          <label>Изображений: </label>
          <input
            type="number"
            :max="200"
            :min="photoLayout?.quantity"
            @input="validateInput"
          />
          <button @click="increasePhotos">Добавить фото</button>
          <button @click="decreasePhotos">Убрать фото</button>
        </div>
        <div class="workspace-container">
          <EditorPhotoPlaceholder
            v-for="(page, index) in project?.pages"
            :key="page.id"
            :photo="page.elements[0]"
            :template="page.layout"
            :index="index"
            :is-dragging="isDraggingFromGallery"
            @add-photo="assignPhotoToPlaceholder"
            @click="() => handleOpenModal(index)"
          />
        </div>
      </div>
      <EditorModal
        v-if="isModalOpen && selectedPlaceholder !== null"
        :photo="project?.pages[selectedPlaceholder]?.elements[0]!"
        :layout="project?.pages[selectedPlaceholder]?.layout!"
        :index="selectedPlaceholder"
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
