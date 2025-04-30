<script setup lang="ts">
import { useImage } from "vue-konva";
import type { PhotoLayout } from "~/repository/layouts";
import type { PhotoData } from "~/repository/projects";

const props = defineProps<{
  photo: PhotoData;
  index: number;
  layout: PhotoLayout;
}>();

const emit = defineEmits<{
  (e: "save", newSrc: string): void;
  (e: "delete"): void;
  (e: "close"): void;
}>();

//Reactive ref
const scale = ref(1);
const imageScale = ref(1);
const containerRef = ref(null);

//virtual scene size:
const sceneWidth = 1000;
const sceneHeight = 1000;

//Computed properties for stage dimensions
const stageWidth = computed(() => sceneWidth * scale.value);
const stageHeight = computed(() => sceneHeight * scale.value);

function updateSize() {
  if (!containerRef.value) return;

  const containerWidth = containerRef.value.offsetWidth;
  scale.value = containerWidth / sceneWidth;
}

const [image, status] = useImage(props.photo.src);

const stageRef = ref();
const imageRef = ref();
const transformerRef = ref();

const DPI = 300;
const borderSizePx = computed(() => {
  const widthMm = props.layout.size.width;
  const heightMm = props.layout.size.height;

  return {
    x: ((stageWidth.value - mmToPx(widthMm, DPI)) / 2) * scale.value, //(ширина сцены - ширина рамки)/2 * масштаб
    y: ((stageHeight.value - mmToPx(heightMm, DPI)) / 2) * scale.value, //аналогично по высоте
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});
const borderData = {
  rectangle: {
    ...borderSizePx.value,
    fill: "rgb(50, 50, 50)",
  },
};

const frameSizePx = computed(() => {
  const widthMm =
    props.layout.size.width - props.layout.size.left - props.layout.size.right;
  const heightMm =
    props.layout.size.height - props.layout.size.top - props.layout.size.bottom;

  return {
    x: ((stageWidth.value - mmToPx(widthMm, DPI)) / 2) * scale.value, //(ширина сцены - ширина рамки)/2 * масштаб
    y: ((stageHeight.value - mmToPx(heightMm, DPI)) / 2) * scale.value,
    width: mmToPx(widthMm, DPI) * scale.value,
    height: mmToPx(heightMm, DPI) * scale.value,
  };
});
const frameData = {
  rectangle: {
    ...frameSizePx.value,
    fill: "rgb(255, 50, 50)",
    opacity: 0.2,
  },
};

function onImageLoad() {
  if (transformerRef.value && imageRef.value) {
    transformerRef.value.nodes([imageRef.value.getNode()]);
  }
}

function handleSave() {
  const uri = stageRef.value?.getStage().toDataURL({ pixelRatio: 2 });
  if (uri) {
    emit("save", uri);
  }
}

function handleDelete() {
  emit("delete");
}

function handleClose() {
  emit("close");
}

onMounted(() => {
  updateSize();
  window.addEventListener("resize", updateSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSize);
});
</script>

<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-content" ref="containerRef">
      <div v-if="status === 'loading'" class="loading">Загрузка...</div>
      <v-stage
        ref="stageRef"
        :config="{
          width: stageWidth,
          height: stageHeight,
          scaleX: scale,
          scaleY: scale,
        }"
      >
        <v-layer>
          <v-image
            v-if="status === 'loaded'"
            ref="imageRef"
            :config="{
          image: image,
          x: sceneWidth/2 - image?.width!/2*imageScale,
          y: sceneHeight/2 - image?.height!/2*imageScale,
          scaleX: imageScale,
          scaleY: imageScale,
        }"
            @load="onImageLoad"
          />
        </v-layer>
        <v-layer>
          <v-rect :config="borderData.rectangle" />
          <v-rect :config="frameData.rectangle" />
        </v-layer>
      </v-stage>

      <div class="modal-actions">
        <button @click="handleSave" class="btn green">Сохранить</button>
        <button @click="handleDelete" class="btn red">Удалить</button>
        <button @click="handleClose" class="btn">Закрыть</button>
      </div>
      <input type="range" min="1" max="5" step="0.1" v-model="imageScale" />
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  min-height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  background: #888;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn.green {
  background: #4caf50;
}

.btn.red {
  background: #f44336;
}

.loading {
  color: black;
  font-size: 18px;
}
</style>
