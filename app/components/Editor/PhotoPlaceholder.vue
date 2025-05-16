<script setup lang="ts">
import type { PhotoLayout } from "~/repository/layouts";
import { useImage } from "vue-konva";
import type { PhotoData } from "~/repository/projects";

const props = defineProps<{
  photo?: PhotoData;
  template: PhotoLayout;
  index: number;
  isDragging: boolean;
}>();

const emit = defineEmits<{
  (e: "add-photo", imageId: string, index: number): void;
  (e: "click", index: number): void;
}>();

const image = ref<HTMLImageElement | null>(null);

watch(
  () => props.photo?.src,
  (newSrc) => {
    if (!newSrc) {
      image.value = null;
      return;
    }

    const img = new Image();
    img.src = newSrc;
    img.onload = () => {
      image.value = img;
    };
  },
  { immediate: true }
);

const imageData = computed(() => {
  if (!image.value || !props.photo) return {};
  return { ...sizePx.value, ...props.photo.crop, image: image.value };
});
/* const [image] = useImage(computed(() => props.photo?.src || "")); */

const DPI = 300; // TODO перенести в родитель и в интерфейс для централизованного хранения
const withText = ref(false);
const isDragOver = ref(false);

const scale = computed(() => {
  const maxWidth = 200;
  return maxWidth / mmToPx(props.template.size.width, DPI);
});

const stageWidth = computed(
  () => mmToPx(props.template.size.width, DPI) * scale.value
);
const stageHeight = computed(
  () => mmToPx(props.template.size.height, DPI) * scale.value
);

const stageSize = computed(() => ({
  width: stageWidth.value,
  height: stageHeight.value,
}));

const sizePx = computed(() => {
  const widthMm =
    props.template.size.width -
    props.template.size.left -
    props.template.size.right;
  const heightMm =
    props.template.size.height -
    props.template.size.top -
    props.template.size.bottom;

  return {
    x: mmToPx(props.template.size.left, DPI) * scale.value,
    y: mmToPx(props.template.size.top, DPI) * scale.value,
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});

const textConfig = {
  x: 0,
  y:
    mmToPx(props.template.size.height - props.template.size.bottom / 2, DPI) *
    scale.value,
  text: "Ваш текст",
  fontSize: 18,
  fontFamily: "Calibri",
  fill: "#555",
  width: 200,
  align: "center",
};

const rectData = {
  rectangle: {
    ...sizePx.value,
    fill: "rgb(204, 204, 204)",
  },
};

function onDragOver(e: DragEvent) {
  if (!image.value) {
    isDragOver.value = true;
    e.dataTransfer!.dropEffect = "copy";
  } else {
    e.dataTransfer!.dropEffect = "none";
  }
}

function onDrop(e: DragEvent) {
  if (image.value) return;
  const imageId = e.dataTransfer?.getData("text/plain");
  isDragOver.value = false;
  if (imageId) {
    emit("add-photo", imageId, props.index);
  }
}

function onClick() {
  emit("click", props.index);
}
</script>

<template>
  <div
    class="photo-canvas"
    :class="{ 'drop-zone': isDragging && !photo }"
    @dragover.prevent="onDragOver"
    @dragleave="isDragOver = false"
    @drop="onDrop"
    @click="onClick"
  >
    <v-stage :config="stageSize">
      <v-layer>
        <v-rect v-if="!image" :config="rectData.rectangle" />
        <v-image v-else :config="imageData" />
        <v-text v-if="withText" :config="textConfig" />
      </v-layer>
    </v-stage>
    <div class="photo-index">{{ index + 1 }}</div>
  </div>
</template>

<style scoped>
.photo-canvas {
  position: relative;
  border: solid 1px black;
}

.photo-index {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.photo-canvas.drop-zone {
  border: 1px dashed #4caf50;
  background-color: rgba(104, 234, 109, 0.1);
}
</style>
