<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const { $api } = useNuxtApp();

const projectId = computed(() => route.params.id as string);
let isProcessingQueue = false;
const DPI = 300;

const { data, status } = await useAsyncData(
  "project",
  () => $api.projects.getById(projectId.value),
  { server: false }
);

/* onMounted(() => {
  window.addEventListener("beforeunload", updateProjectBeforeExit);
});
onUnmounted(() => {
  window.removeEventListener("beforeunload", updateProjectBeforeExit);
}); */

const isDraggingFromGallery = ref(false);
const isAutoPlacing = ref(true);

//Логика для сохранения проекта при обновлении/закрытии вкладки
/* async function updateProjectBeforeExit() {
  if (project.value) {
    try {
      await projects.updateProject(project.value);
    } catch (e) {
      console.error("Ошибка при обновлении проекта перед выходом:", e);
    }
  }
} */

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

// Для модалки
const isModalOpen = ref(false);
const selectedPlaceholder = ref<number | null>(null); //индекс выбранного placeholder - emit

/* function handleOpenModal(index: number) {
  const projectValue = project.value;
  const page = projectValue?.pages[index];
  if (page?.elements.length) {
    selectedPlaceholder.value = index;
    isModalOpen.value = true;
  }
} */

/* function increasePhotos() {
  const projectValue = project.value;
  if (!projectValue) return;

  projectValue.pages.push({
    id: crypto.randomUUID(),
    layout: structuredClone(toRaw(layout.value!)),
    elements: [],
    textBlocks: [],
  });
} */
/* function decreasePhotos() {
  const projectValue = project.value;
  if (!projectValue) return;

  if (projectValue.pages.length > (layout.value?.quantity || 1)) {
    projectValue.pages.pop();
  }
} */
</script>

<template>
  <div class="base-editor-layout">
    <client-only>
      <div class="workspace">
        <div class="workspace-info">
          <div>Проект: {{}}</div>
          <input type="checkbox" v-model="isAutoPlacing" />
          <label>Изображений: </label>
          <!-- <input
            type="number"
            :max="200"
            :min="layout?.quantity"
            @input="validateInput"
          /> -->
          <UButton color="info" @click="console.log('save project')"
            >Сохранить проект</UButton
          >
        </div>
        <div class="flex-row-container">
          <div class="editor-panel">
            <EditorPanel :project-id="id" />
          </div>

          <div class="workspace-container">
            <EditorPlaceholder v-for="page in project?.pages" />
          </div>
        </div>
      </div>
      <!-- <EditorModal
        v-if="isModalOpen && selectedPlaceholder !== null"
        :photo="project?.pages[selectedPlaceholder]?.elements[0]!"
        :layout="project?.pages[selectedPlaceholder]?.layout!"
        :index="selectedPlaceholder"
        @save="handleSaveEditedImage"
        @delete="handleDeleteImage"
        @close="isModalOpen = false"
      /> -->
    </client-only>
  </div>
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
