<script setup lang="ts">
import type { PhotoLayout } from "~/repository/layouts";
import { useImage } from "vue-konva";

const props = defineProps<{
  photo: PhotoLayout;
  index: number;
  isDragging: boolean;
  src: string;
}>();

const emit = defineEmits<{
  (e: "update", payload: { index: number; src: string }): void;
}>();

const [image] = useImage(props.src);

watch(
  () => props.src,
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

const DPI = 300;
const withText = ref(false);
const isDragOver = ref(false);

function mmToPx(mm: number, DPI: number): number {
  return (mm / 25.4) * DPI; //mm -> inch -> pixels
}

const scale = computed(() => {
  const maxWidth = 200;
  return maxWidth / mmToPx(props.photo.size.width, DPI);
});

const stageWidth = computed(
  () => mmToPx(props.photo.size.width, DPI) * scale.value
);
const stageHeight = computed(
  () => mmToPx(props.photo.size.height, DPI) * scale.value
);

const stageSize = computed(() => ({
  width: stageWidth.value,
  height: stageHeight.value,
}));

const sizePx = computed(() => {
  const widthMm =
    props.photo.size.width - props.photo.size.left - props.photo.size.right;
  const heightMm =
    props.photo.size.height - props.photo.size.top - props.photo.size.bottom;

  return {
    x: mmToPx(props.photo.size.left, DPI) * scale.value,
    y: mmToPx(props.photo.size.top, DPI) * scale.value,
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});

function getCrop(
  image: HTMLImageElement,
  size: { width: number; height: number }
) {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

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
}

const crop = computed(() => {
  if (!image.value) return {};
  return getCrop(image.value, {
    width: sizePx.value.width,
    height: sizePx.value.height,
  });
});

const textConfig = {
  x: 0,
  y:
    mmToPx(props.photo.size.height - props.photo.size.bottom / 2, DPI) *
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
const imageData = computed(() => ({
  ...sizePx.value,
  ...crop.value,
  image: image.value,
}));

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
  const url = e.dataTransfer?.getData("text/plain");
  isDragOver.value = false;
  if (url) {
    /* src.value = url; */
    emit("update", { index: props.index, src: url });
  }
}
</script>

<template>
  <div
    class="photo-canvas"
    :class="{ 'drop-zone': isDragging && !props.src }"
    @dragover.prevent="onDragOver"
    @dragleave="isDragOver = false"
    @drop="onDrop"
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
