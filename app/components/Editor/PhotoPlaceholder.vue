<script setup lang="ts">
import type { PhotoLayout } from "~/repository/layouts";
import type { ProjectPage, PhotoData } from "~/repository/projects";

const props = defineProps<{
  /* page: ProjectPage; */
  element: PhotoData | null;
  layout: PhotoLayout;
  index: number;
  isDragging: boolean;
}>();

const emit = defineEmits<{
  (e: "add-photo", imageId: string, index: number): void;
  (e: "click", index: number): void;
}>();

const image = ref<HTMLImageElement | null>(null);
const container = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
let resizeObserver: ResizeObserver;

onMounted(() => {
  if (container.value) {
    containerWidth.value = container.value.clientWidth;

    resizeObserver = new ResizeObserver(() => {
      if (container.value) {
        containerWidth.value = container.value.clientWidth;
      }
    });
    resizeObserver.observe(container.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && container.value) {
    resizeObserver.disconnect();
  }
});

watch(
  () => props.element?.src,
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
  if (!image.value || !props.element) return {};
  return {
    ...sizePx.value,
    ...props.element.crop,
    image: image.value,
  };
});
/* const [image] = useImage(computed(() => props.photo?.src || "")); */

const DPI = 300; // TODO перенести в родитель и в интерфейс для централизованного хранения
const withText = ref(false);
const isDragOver = ref(false);

const scale = computed(() => {
  const layoutWidthPx = mmToPx(props.layout.size.width, DPI);
  if (layoutWidthPx === 0) return 1;
  return containerWidth.value / layoutWidthPx;
});

const stageWidth = computed(
  () => mmToPx(props.layout.size.width, DPI) * scale.value
);
const stageHeight = computed(
  () => mmToPx(props.layout.size.height, DPI) * scale.value
);

const stageSize = computed(() => ({
  width: stageWidth.value,
  height: stageHeight.value,
}));

const sizePx = computed(() => {
  const widthMm =
    props.layout.size.width - props.layout.size.left - props.layout.size.right;
  const heightMm =
    props.layout.size.height - props.layout.size.top - props.layout.size.bottom;

  return {
    x: mmToPx(props.layout.size.left, DPI) * scale.value,
    y: mmToPx(props.layout.size.top, DPI) * scale.value,
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});

watch(sizePx, (val) => {
  console.log("sizePx изменился:", val);
});

const textConfig = {
  x: 0,
  y:
    mmToPx(props.layout.size.height - props.layout.size.bottom / 2, DPI) *
    scale.value,
  text: "Ваш текст",
  fontSize: 18,
  fontFamily: "Calibri",
  fill: "#555",
  width: 200,
  align: "center",
};

const rectData = computed(() => ({
  rectangle: {
    ...sizePx.value,
    fill: "rgb(204, 204, 204)",
  },
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
  if (props.element?.src) return;
  //if (image.value) return;
  const imageId = e.dataTransfer?.getData("text/plain");
  isDragOver.value = false;
  if (imageId) {
    emit("add-photo", imageId, props.index);
  }
}

function onClick() {
  emit("click", props.index);
}

function handleInfoClick() {
  console.log("image: ", image);
  console.log("rect params: ", rectData);
}
</script>

<template>
  <div
    ref="container"
    class="photo-canvas"
    :class="{ 'drop-zone': isDragging && !props.element }"
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
    <UButton @click="handleInfoClick">Инфо</UButton>
    <div class="photo-index">{{ index + 1 }}</div>
  </div>
</template>

<style scoped>
.photo-canvas {
  position: relative;
  border: solid 1px black;
  width: 100%;
  max-width: 400px;
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
