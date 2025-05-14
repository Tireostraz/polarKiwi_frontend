<script setup lang="ts">
import { useImage } from "vue-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { PhotoLayout } from "~/repository/layouts";
import type { PhotoData } from "~/repository/projects";
import type { Context } from "konva/lib/Context";
import type { Shape } from "konva/lib/Shape";

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
const containerRef = ref<HTMLElement | null>(null);

//virtual scene size:
const sceneWidth = 1300;
const sceneHeight = 1300;

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

// Размеры границы фото с рамкой
const borderSizePx = computed(() => {
  const widthMm = props.layout.size.width;
  const heightMm = props.layout.size.height;

  return {
    x: (sceneWidth - mmToPx(widthMm, DPI)) / 2, //(ширина сцены - ширина рамки)/2
    y: (sceneHeight - mmToPx(heightMm, DPI)) / 2, //аналогично по высоте
    width: mmToPx(widthMm, DPI),
    height: mmToPx(heightMm, DPI),
  };
});

// Размеры кадра
const frameSizePx = computed(() => {
  const frameWidth = mmToPx(
    props.layout.size.width - props.layout.size.left - props.layout.size.right,
    DPI
  );
  const frameHeight = mmToPx(
    props.layout.size.height - props.layout.size.top - props.layout.size.bottom,
    DPI
  );
  const top = mmToPx(props.layout.size.top, DPI);
  const left = mmToPx(props.layout.size.left, DPI);
  const bottom = mmToPx(props.layout.size.bottom, DPI);
  const right = mmToPx(props.layout.size.right, DPI);

  return {
    x: (sceneWidth - frameWidth) / 2,
    y: (sceneHeight - frameHeight - top - bottom) / 2 + top,
    width: frameWidth,
    height: frameHeight,
  };
});

// Размеры изображения
const imageSize = computed(() => {
  let imageX: number = 0;
  let imageY: number = 0;
  let imageWidth = props.photo.width;
  let imageHeight = props.photo.height;
  let minScale: number = 1;
  let scale: number = 1;

  const frameX = frameSizePx.value.x;
  const frameY = frameSizePx.value.y;
  const frameWidth = frameSizePx.value.width;
  const frameHeight = frameSizePx.value.height;

  if (frameWidth / frameHeight < imageWidth / imageHeight) {
    scale = frameHeight / imageHeight;
    minScale = frameWidth / imageWidth;
    imageHeight = imageHeight * scale;
    imageWidth = imageWidth * scale;
    imageX = frameX + (imageWidth - frameWidth) / 2;
    imageY = frameY + (imageHeight - frameHeight) / 2;
  } else {
    scale = frameWidth / imageWidth;
    minScale = frameHeight / imageHeight;
    imageHeight = imageHeight * scale;
    imageWidth = imageWidth * scale;
    imageX = frameX + (imageWidth - frameWidth) / 2;
    imageY = frameY + (imageHeight - frameHeight) / 2;
  }
  return {
    x: imageX,
    y: imageY,
    width: imageWidth,
    height: imageHeight,
    scale: scale,
    minScale: minScale,
  };
});
const minImageScale = ref(imageSize.value.minScale);
const imageScale = ref(imageSize.value.scale);
const imageDegrees = ref(0);
const imageX = ref<number>(imageSize.value.x);
const imageY = ref<number>(imageSize.value.y);

const frameFunc = computed(() => {
  return function (context: Context, shape: Shape): void {
    context.beginPath();
    context.rect(
      borderSizePx.value.x,
      borderSizePx.value.y,
      borderSizePx.value.width,
      borderSizePx.value.height
    );
    context.rect(
      frameSizePx.value.x,
      frameSizePx.value.y,
      frameSizePx.value.width,
      frameSizePx.value.height
    );
    context.closePath();
    context.fillStyle = "rgba(255,255,255, 0.9)";
    context.fill("evenodd");
  };
});
const borderFunc = computed(() => {
  return function (context: Context, shape: Shape): void {
    context.beginPath();
    context.rect(0, 0, sceneWidth, sceneHeight);
    context.rect(
      borderSizePx.value.x,
      borderSizePx.value.y,
      borderSizePx.value.width,
      borderSizePx.value.height
    );
    context.closePath();
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.fill("evenodd");
  };
});

const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
  const imageWidth = props.photo.width * imageScale.value;
  const imageHeight = props.photo.height * imageScale.value;
  const minX = frameSizePx.value.x + imageWidth / 2;
  const maxX = frameSizePx.value.x + frameSizePx.value.width - imageWidth / 2;

  e.target.x(Math.min(Math.max(e.target.x(), minX), maxX));

  const minY = frameSizePx.value.y + imageHeight / 2;
  const maxY = frameSizePx.value.y + frameSizePx.value.height - imageHeight / 2;
  e.target.y(Math.min(Math.max(e.target.y(), minY), maxY));
};

function getInfo() {
  console.log("Border size: ", borderSizePx.value);
  console.log(
    "Frame size: ",
    frameSizePx.value.x,
    frameSizePx.value.y,
    frameSizePx.value.width,
    frameSizePx.value.height
  );

  console.log("Stage size: ", stageWidth.value, stageHeight.value, scale.value);
}

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

function handleRotate(deg: number) {
  imageDegrees.value = imageDegrees.value + deg;
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
              x: frameSizePx.x + frameSizePx.width / 2,
              y: frameSizePx.y + frameSizePx.height / 2,
              offsetX: props.photo.width / 2,
              offsetY: props.photo.height / 2,
              rotation: imageDegrees,
              scaleX: imageScale,
              scaleY: imageScale,
              draggable: true,
            }"
            @dragmove="handleDragMove"
            @load="onImageLoad"
          />
        </v-layer>
        <v-layer>
          <v-shape
            :config="{
              width: 0,
              height: 0,
              sceneFunc: borderFunc,
            }"
          />
        </v-layer>
        <v-layer>
          <v-shape :config="{ width: 0, height: 0, sceneFunc: frameFunc }" />
        </v-layer>
      </v-stage>

      <div class="modal-actions">
        <button @click="handleSave" class="btn green">Сохранить</button>
        <button @click="handleDelete" class="btn red">Удалить</button>
        <button @click="handleClose" class="btn">Закрыть</button>
        <button @click="handleRotate(-90)"><- Туда</button>
        <button @click="handleRotate(90)">Сюда -></button>
        <button @click="getInfo">Получить информацию</button>
      </div>
      <input
        type="range"
        :min="imageSize.minScale"
        max="5"
        step="0.01"
        v-model.number="imageScale"
      />
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
