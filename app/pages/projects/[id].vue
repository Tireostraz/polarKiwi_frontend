<script setup lang="ts">
import type { PhotoData, Project } from "~/repository/projects";
import type { PhotoLayout } from "~/repository/layouts";

definePageMeta({ layout: false });

const route = useRoute();
const { $api } = useNuxtApp();
const projects = useProjectsStore();

const id = computed(() => route.params.id as string);
const isLoading = ref(true);
const project = ref<Project | null>(null);
const layout = ref<PhotoLayout | null>(null);

const photoQueue: PhotoData[] = [];
let isProcessingQueue = false;
const DPI = 300;

onMounted(async () => {
  try {
    // 1. Загружаем проект по ID
    /* const loadedProject = await $api.projects.get(id.value); */
    const loadedProject = projects.addedProjects.find((p) => p.id === id.value);
    if (loadedProject) {
      project.value = loadedProject;
    }

    // 2. Загружаем layout по формату
    layout.value = await $api.layouts.getPhotoLayout(project.value.format);

    // 3. Устанавливаем layout только если его нет
    if (layout.value) {
      project.value.pages = project.value.pages.map((page) => ({
        ...page,
        layout: page.layout ?? structuredClone(toRaw(layout.value!)),
      }));
    }

    isLoading.value = false;
  } catch (e) {
    console.error("Ошибка при инициализации проекта:", e);
  }
});

onMounted(() => {
  window.addEventListener("beforeunload", updateProjectBeforeExit);
});
onUnmounted(() => {
  window.removeEventListener("beforeunload", updateProjectBeforeExit);
});

const isDraggingFromGallery = ref(false);
const isAutoPlacing = ref(true);

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

// Добавление фото
const addPhoto = (photoData: PhotoData) => {
  if (!project.value) return;

  const existing = project.value.photos.find((p) => p.id === photoData.id);
  if (!existing) return;

  if (isAutoPlacing.value) {
    existing.used = true;
    photoQueue.push(photoData);
    if (!isProcessingQueue) {
      processNextPhoto();
    }
  }
};

const processNextPhoto = () => {
  if (photoQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const nextPhoto = photoQueue.shift();
  if (!nextPhoto) return;

  placePhotoInNextAvailablePlaceholder(nextPhoto).then(() => {
    processNextPhoto(); // запускаем следующую
  });
};

const placePhotoInNextAvailablePlaceholder = async (photoData: PhotoData) => {
  return new Promise<void>((resolve) => {
    const projectValue = project.value;
    if (!projectValue || !layout.value) return resolve();

    const firstEmptyIndex = projectValue.pages.findIndex(
      (page) => page.elements.length === 0
    );

    const photo = projectValue.photos.find(
      (photo) => photo.id === photoData.id
    );
    if (!photo) return;

    photo.used = true;

    const targetIndex =
      firstEmptyIndex === -1 ? projectValue.pages.length : firstEmptyIndex;

    if (firstEmptyIndex === -1) {
      increasePhotos(); // создаём новую страницу
    }

    const img = new Image();
    img.src = photoData.src;
    img.onload = () => {
      const placeholderSize = {
        width: mmToPx(
          layout.value!.size.width -
            layout.value!.size.left -
            layout.value!.size.right,
          DPI
        ),
        height: mmToPx(
          layout.value!.size.height -
            layout.value!.size.top -
            layout.value!.size.bottom,
          DPI
        ),
      };

      const crop = cropImageToPlaceholder(img, placeholderSize);

      const assignedPhoto: PhotoData = {
        id: photoData.id,
        src: photoData.src,
        width: img.width,
        height: img.height,
        crop,
        scale: 1,
        rotation: 0,
      };

      const targetPage = projectValue.pages[targetIndex];
      if (targetPage) {
        targetPage.elements.push(assignedPhoto);
      } else {
        projectValue.pages[targetIndex] = {
          id: crypto.randomUUID(),
          layout: structuredClone(layout.value!),
          elements: [assignedPhoto],
          textBlocks: [],
        };
      }

      resolve(); // важный момент — продолжаем очередь
    };

    img.onerror = () => {
      console.error("Ошибка загрузки изображения:", photoData.src);
      resolve(); // даже при ошибке продолжаем очередь
    };
  });
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

  const photo = projectValue.photos.find((photo) => photo.id === photoId);
  if (!photo) return;

  photo.used = true;

  if (!layout.value) return;

  const img = new Image();
  img.src = photo.url;
  img.onload = () => {
    const placeholderSize = {
      width: mmToPx(
        layout.value?.size.width! -
          layout.value?.size.left! -
          layout.value?.size.right!,
        DPI
      ),
      height: mmToPx(
        layout.value?.size.height! -
          layout.value?.size.top! -
          layout.value?.size.bottom!,
        DPI
      ),
    };

    const crop = cropImageToPlaceholder(img, placeholderSize);

    const assignedPhoto: PhotoData = {
      id: photo.id,
      src: photo.url,
      width: img.width,
      height: img.height,
      crop,
      scale: 1,
      rotation: 0,
    };

    const page = projectValue.pages[index];
    if (page) {
      page.elements.push(assignedPhoto);
    } else {
      // если страницы не существует, создаём
      projectValue.pages[index] = {
        id: crypto.randomUUID(),
        layout: structuredClone(layout.value!),
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

function handlePlaceholderClick(
  placeholderIndex: number,
  elementIndex: number
) {
  console.log("placegolder", index, "clicked");
  const projectValue = project.value;
  const page = projectValue?.pages[index];
  console.log(page);
  if (page?.elements) {
    selectedPlaceholder.value = index;
    isModalOpen.value = true;
  } else {
    console.log("upload image");
  }
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
    layout: structuredClone(toRaw(layout.value!)),
    elements: [],
    textBlocks: [],
  });
}
function decreasePhotos() {
  const projectValue = project.value;
  if (!projectValue) return;

  if (projectValue.pages.length > (layout.value?.quantity || 1)) {
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

/* async function confirmExit(shouldExit: boolean) {
  showExitConfirm.value = false;
  if (shouldExit) {
    await updateProjectBeforeExit();
    if (nextRoute.value) {
      navigateTo(nextRoute.value.fullPath);
    }
  } else {
    nextRoute.value = null; // сброс
  }
} */
</script>

<template>
  <div class="base-editor-layout" v-if="!isLoading">
    <client-only>
      <!-- <EditorUploader
        :project-id="id"
        :isauto-placing="isAutoPlacing"
        @add-image="addPhoto"
        @drag-start="isDraggingFromGallery = true"
        @drag-end="isDraggingFromGallery = false"
      /> -->

      <div class="workspace">
        <div class="workspace-info">
          <div>Проект: {{ layout?.title }}</div>
          <input type="checkbox" v-model="isAutoPlacing" />
          <label>Изображений: </label>
          <input
            type="number"
            :max="200"
            :min="layout?.quantity"
            @input="validateInput"
          />
          <UButton color="info" @click="updateProjectBeforeExit"
            >Сохранить проект</UButton
          >
        </div>
        <div class="flex-row-container">
          <div class="editor-panel">
            <EditorPanel :project-id="id" />
          </div>

          <div class="workspace-container">
            <EditorPhotoPlaceholder
              v-for="(page, index) in project?.pages"
              :key="page.id"
              :element="page.elements[0] || null"
              :layout="page.layout"
              :index="index"
              :is-dragging="isDraggingFromGallery"
              @add-photo="assignPhotoToPlaceholder"
              @click="() => handlePlaceholderClick(index)"
            />
          </div>
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
  <!--  <UModal v-model="showExitConfirm">
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
  </UModal> -->
</template>

<style scoped>
.base-editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.workspace {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.workspace-info {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  flex-shrink: 0;
  overflow: hidden;
}

.flex-row-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
}

.editor-panel {
  width: 250px; /* ширина панели */
  flex-shrink: 0;
  overflow: hidden;
  background-color: #f3f3f3; /* для визуального разделения */
}

.workspace-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  padding: 40px 50px;
  overflow-y: auto;
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
