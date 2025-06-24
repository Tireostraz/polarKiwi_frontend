<script setup lang="ts">
import type { PhotoData } from "~/repository/projects";
const props = defineProps<{
  projectId: string;
  isautoPlacing: boolean;
}>();

const emit = defineEmits<{
  (e: "drag-start"): void;
  (e: "drag-end"): void;
  (e: "add-image", photoData: PhotoData): void;
}>();

const projects = useProjectsStore();
const project = computed(() =>
  projects.addedProjects.find((project) => project.id === props.projectId)
);

const isOpen = ref(false);
const isFullscreen = ref(false);
const mode = ref("myImages");
const fileInput = ref<HTMLInputElement | null>(null);

const { $api } = useNuxtApp();

onMounted(() => {
  checkResize();
  window.addEventListener("resize", checkResize);
});

const checkResize = () => {
  isFullscreen.value = window.innerWidth < 960;
};

const handleUploadClick = () => {
  fileInput.value?.click();
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  for (const file of files) uploadAndAddFile(file);
};

const uploadAndAddFile = async (file: File) => {
  try {
    const data = await $api.uploader.uploadImage(file, props.projectId);
    if (!data) return;

    const uploadedPhoto = {
      id: data.filename,
      url: data.url,
      used: props.isautoPlacing,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    };

    project.value?.photos.push(uploadedPhoto);
    const photoData = await createUploadedPhoto(data.filename, data.url);
    emit("add-image", photoData);
  } catch (err) {
    console.error("Ошибка загрузки файла", err);
  }
};

async function createUploadedPhoto(
  id: string,
  url: string
): Promise<PhotoData> {
  const img = new Image();
  img.src = url;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject();
  });

  const photoData: PhotoData = {
    id,
    src: img.src,
    width: img.width,
    height: img.height,
    scale: 1,
    rotation: 0,
  };

  return photoData;
}

onUnmounted(() => {
  window.removeEventListener("resize", checkResize);
});
</script>
<template>
  <UModal
    :ui="{
      content: 'md:max-w-[970px] md:max-h-[656px] md:m-6 md:rounded-3xl h-full',
    }"
    v-model="isOpen"
    :fullscreen="isFullscreen"
    title="Modal with title"
  >
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #content>
      <div class="flex flex-col h-full">
        <div class="flex justify-center border-b-1 border-gray-300 p-3">
          Выбор фото
        </div>
        <div class="flex flex-col-reverse md:flex-row grow">
          <div
            class="flex gap-2 flex-row md:flex-col border-r-1 md:border-t-1 border-gray-200"
          >
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:image"
              @click="mode = 'myImages'"
              >Мои изображения</UButton
            >
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:tablet-smartphone"
              @click="mode = 'import'"
              >Импорт с телефона</UButton
            >
            <UButton
              color="neutral"
              variant="soft"
              icon="mdi:google"
              @click="mode = 'google'"
              >Google изображения</UButton
            >
            <UButton
              color="neutral"
              variant="soft"
              icon="mdi:human-handsup"
              @click="mode = 'friendsImport'"
              >Изображения от семьи и друзей</UButton
            >
          </div>
          <div class="flex grow">
            <div
              v-if="mode === 'myImages'"
              class="flex flex-col text-center justify-center items-center grow gap-4 bg-sky-100 rounded-xl m-3 hover:scale-98 transition-all"
            >
              <Icon name="lucide:folder-open" size="72" />
              <h2 class="text-lg font-bold">Загрузите ваши изображения</h2>
              <p>
                <del>Просто перетащите сюда ваши изображения </del><br />
                или воспользуйтесь кнопкой ниже
              </p>
              <span>
                <UButton @click="handleUploadClick"
                  >Выбрать изображения</UButton
                >
              </span>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              hidden
            />
            <div v-if="mode === 'import'">Import</div>
            <div v-if="mode === 'google'">Google</div>
            <div v-if="mode === 'friendsImport'">Friends Import</div>
          </div>
        </div>
        <div class="flex justify-center border-t-1 border-gray-200 p-3">
          <UButton color="neutral">Загрузить изображения</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
<style></style>
