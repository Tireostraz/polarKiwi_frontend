<script setup lang="ts">
import type { PhotoData } from "~/repository/projects";
import { mmToPx } from "#imports";

definePageMeta({ layout: "projects" });
const projects = useProjectsStore();

const route = useRoute();
const { $api } = useNuxtApp();
const DPI = 300;

//Для сохранения проекта
const showExitConfirm = ref(false);
const nextRoute = ref(null);

const id = computed(() => route.params.id as string);
const project = computed(() =>
  projects.addedProjects.find((project) => project.id === id.value)
);

//Логика для сохранения проекта при обновлении/закрытии вкладки
async function updateProjectBeforeExit() {
  if (project.value) {
    try {
      await projects.updateProject(project.value);
    } catch (e) {
      console.error("Ошибка при обновлении проекта перед выходом:", e);
    }
  }
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  updateProjectBeforeExit(); // Async здесь не сработает нормально, лучше sync или флаг
  event.preventDefault();
  event.returnValue = ""; // Стандартный способ показать confirm диалог
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});
onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

// TODO: добавить Critical на await fetch для гарантии получения данных
const { data: photoLayout } = await useAsyncData(
  `${project.value!.format}`,
  () => $api.layouts.getPhotoLayout(project.value!.format)
);

if (photoLayout.value && project.value) {
  // добавить логику для исключения переприсвоения layout если уже он там есть (не null)
  project.value.pages = project.value.pages.map((page) => ({
    ...page,
    layout: structuredClone(photoLayout.value!),
  }));
}

const isDraggingFromGallery = ref(false); //для анимации куда можно drag and drop (стили)
const isAutoPlacing = ref(false);

const addPhoto = (photoData: PhotoData) => {
  //формирование массива из объектов данных о загруженных фото photo
  if (isAutoPlacing.value) {
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
  img.src = photo.url;
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

async function confirmExit(shouldExit: boolean) {
  showExitConfirm.value = false;
  if (shouldExit) {
    await updateProjectBeforeExit();
    if (nextRoute.value) {
      navigateTo(nextRoute.value.fullPath);
    }
  } else {
    nextRoute.value = null; // сброс
  }
}
</script>

<template>
  <div class="base-editor-layout">
    <client-only>
      <EditorUploader
        :project-id="id"
        :isauto-placing="isAutoPlacing"
        @add-image="addPhoto"
        @drag-start="isDraggingFromGallery = true"
        @drag-end="isDraggingFromGallery = false"
      />

      <div class="workspace">
        <div class="workspace-info">
          <div>Проект: {{ photoLayout?.title }}</div>
          <input type="checkbox" v-model="isAutoPlacing" />
          <label>Изображений: </label>
          <input
            type="number"
            :max="200"
            :min="photoLayout?.quantity"
            @input="validateInput"
          />
          <UButton color="secondary" variant="subtle" @click="increasePhotos"
            >Добавить фото</UButton
          >
          <UButton color="secondary" variant="subtle" @click="decreasePhotos"
            >Убрать фото</UButton
          >
        </div>
        <div class="workspace-container">
          <EditorPhotoPlaceholder
            v-for="(page, index) in project?.pages"
            :key="page.id"
            :photo="page.elements[0]"
            :template="page.layout!"
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

      <!-- <UButton class="submit-btn">Добавить в корзину</UButton> -->
    </client-only>
  </div>
  <UModal v-model="showExitConfirm">
    <template #content>
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-2">Вы точно хотите выйти?</h2>
        <p class="mb-4">Все изменения будут сохранены.</p>
        <div class="flex justify-end gap-2">
          <UButton @click="confirmExit(true)">Да</UButton>
          <UButton color="info" @click="confirmExit(false)">Нет</UButton>
        </div>
      </div>
    </template>
  </UModal>
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
