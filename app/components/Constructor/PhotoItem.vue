<script setup lang="ts">
import type { PhotoLayout } from "~/repository/layouts";
import { useImage } from "vue-konva";

//const src = ref(""); // сюда будем класть base64

const props = defineProps<{
  photo: PhotoLayout;
  index: number;
  isDragging: boolean;
  src: string;
}>();

const emit = defineEmits<{
  (e: "update", payload: { index: number; src: string }): void;
}>();

const imageObj = ref<HTMLImageElement | null>(null);

watch(
  () => props.src,
  (newSrc) => {
    if (!newSrc) {
      imageObj.value = null;
      return;
    }
    const img = new window.Image();
    img.src = newSrc;
    img.onload = () => {
      imageObj.value = img;
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
  return maxWidth / stageWidth;
});

const sizePx = computed(() => {
  const widthMm =
    props.photo.size.width - props.photo.size.left - props.photo.size.right;
  const heightMm =
    props.photo.size.height - props.photo.size.top - props.photo.size.bottom;

  return {
    x: mmToPx(props.photo.size.top, DPI) * scale.value,
    y: mmToPx(props.photo.size.left, DPI) * scale.value,
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});

const stageWidth = mmToPx(props.photo.size.width, DPI);
const stageHeight = mmToPx(props.photo.size.height, DPI);

const stageSize = {
  width: stageWidth * scale.value,
  height: stageHeight * scale.value,
};

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
  image: imageObj.value,
}));

function onDragOver(e: DragEvent) {
  if (!imageObj.value) {
    isDragOver.value = true;
    e.dataTransfer!.dropEffect = "copy";
  } else {
    e.dataTransfer!.dropEffect = "none";
  }
}

function onDrop(e: DragEvent) {
  if (imageObj.value) return;
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
        <v-rect v-if="!imageObj" :config="rectData.rectangle" />
        <v-image v-else :config="imageData" />
        <v-text v-if="withText" :config="textConfig" />
      </v-layer>
    </v-stage>
    <div class="photo-index">{{ index }}</div>
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
