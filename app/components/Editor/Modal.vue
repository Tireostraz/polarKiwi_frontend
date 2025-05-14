<script setup lang="ts">
import { useImage } from "vue-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { PhotoLayout } from "~/repository/layouts";
import type { PhotoData } from "~/repository/projects";
import type { Context } from "konva/lib/Context";
import type { Shape } from "konva/lib/Shape";
import type { Stage } from "konva/lib/Stage";
import type { Image } from "konva/lib/shapes/Image";

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

//photo size:
const photoWidth = ref<number>(props.photo.width);
const photoHeight = ref<number>(props.photo.height);

//Computed properties for stage dimensions
const stageWidth = computed(() => sceneWidth * scale.value);
const stageHeight = computed(() => sceneHeight * scale.value);

function updateSize() {
  if (!containerRef.value) return;

  const containerWidth = containerRef.value.offsetWidth;
  scale.value = containerWidth / sceneWidth;
}

const [image, status] = useImage(props.photo.src);

const stageRef = ref<{ getStage: () => Stage } | null>(null);
const imageRef = ref();
const transformerRef = ref();

const DPI = 300;

//Закрытие модального окна только при полном клике
let isMouseDownOutside = false;
function onBackdropMouseDown(e: MouseEvent) {
  if (!containerRef.value?.contains(e.target as Node)) {
    isMouseDownOutside = true;
  } else {
    isMouseDownOutside = false;
  }
}
function onBackdropMouseUp(e: MouseEvent) {
  if (!containerRef.value?.contains(e.target as Node) && isMouseDownOutside) {
    handleClose();
  }
}

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
  let imageWidth = photoWidth.value;
  let imageHeight = photoHeight.value;
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
    imageX = frameX + frameWidth / 2;
    imageY = frameY + frameHeight / 2;
  } else {
    scale = frameWidth / imageWidth;
    minScale = frameHeight / imageHeight;
    imageHeight = imageHeight * scale;
    imageWidth = imageWidth * scale;
    imageX = frameX + frameWidth / 2;
    imageY = frameY + frameHeight / 2;
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
const maxImageScale = ref(2);
const imageScale = ref(imageSize.value.scale);
const imageDegrees = ref(0);
/* const imageX = ref<number>(imageSize.value.x);
const imageY = ref<number>(imageSize.value.y); */
const isImageDraggable = ref(true);

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
  const imageWidth = photoWidth.value * imageScale.value;
  const imageHeight = photoHeight.value * imageScale.value;
  if (
    imageWidth <= frameSizePx.value.width &&
    imageHeight <= frameSizePx.value.height
  )
    return;

  const minX = frameSizePx.value.x + frameSizePx.value.width - imageWidth / 2;
  const maxX = frameSizePx.value.x + imageWidth / 2;

  e.target.x(Math.min(Math.max(e.target.x(), minX), maxX));

  const minY = frameSizePx.value.y + frameSizePx.value.height - imageHeight / 2;
  const maxY = frameSizePx.value.y + imageHeight / 2;
  e.target.y(Math.min(Math.max(e.target.y(), minY), maxY));
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

function handleRotate(deg: number) {
  imageDegrees.value = imageDegrees.value + deg;
  [photoWidth.value, photoHeight.value] = [photoHeight.value, photoWidth.value];
}

function onWheelZoom(e: KonvaEventObject<WheelEvent>) {
  e.evt.preventDefault();
  const stage = stageRef.value?.getStage();
  if (!stage) return;

  const pointer = stage.getPointerPosition();
  if (!pointer) return;

  const { x, y } = pointer;
  const isInsideFrame =
    x >= frameSizePx.value.x * scale.value &&
    x <= (frameSizePx.value.x + frameSizePx.value.width) * scale.value &&
    y >= frameSizePx.value.y * scale.value &&
    y <= (frameSizePx.value.y + frameSizePx.value.height) * scale.value;
  if (!isInsideFrame) return;

  const zoomStep = 0.05;
  const newScale = imageScale.value + (e.evt.deltaY > 0 ? -zoomStep : zoomStep);

  imageScale.value = Math.max(
    Math.min(newScale, maxImageScale.value),
    imageSize.value.minScale
  );
}

function handleScaleChange() {
  const imageNode = imageRef.value.getNode();
  if (!imageNode) return;

  /*  const x = imageNode.attrs.x;
  const y = imageNode.attrs.y;

  const imageWidth = photoWidth.value * imageScale.value;
  const imageHeight = photoHeight.value * imageScale.value;

  const minX = frameSizePx.value.x + frameSizePx.value.width - imageWidth / 2;
  const maxX = frameSizePx.value.x + imageWidth / 2;

  const minY = frameSizePx.value.y + frameSizePx.value.height - imageHeight / 2;
  const maxY = frameSizePx.value.y + imageHeight / 2;

  const isInsideFrame = x >= minX && x <= maxX && y >= minY && y <= maxY; */

  const newScale = imageScale.value;

  const newWidth = photoWidth.value * newScale;
  const newHeight = photoHeight.value * newScale;

  const frame = frameSizePx.value;

  let x = imageNode.x();
  let y = imageNode.y();

  // Проверка смещений при масштабировании
  const halfWidth = newWidth / 2;
  const halfHeight = newHeight / 2;

  const left = x - halfWidth;
  const right = x + halfWidth;
  const top = y - halfHeight;
  const bottom = y + halfHeight;

  let offsetX = 0;
  let offsetY = 0;

  if (left > frame.x) {
    offsetX = frame.x - left;
  }
  if (right < frame.x + frame.width) {
    offsetX = frame.x + frame.width - right;
  }

  if (top > frame.y) {
    offsetY = frame.y - top;
  }
  if (bottom < frame.y + frame.height) {
    offsetY = frame.y + frame.height - bottom;
  }

  // Применяем позицию и масштаб
  imageNode.scale({ x: newScale, y: newScale });
  imageNode.position({ x: x + offsetX, y: y + offsetY });

  /* imageNode.position({
    x: imageSize.value.x,
    y: imageSize.value.y,
  }); */
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
  <div
    class="modal-backdrop"
    @mousedown="onBackdropMouseDown"
    @mouseup="onBackdropMouseUp"
  >
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
        @wheel="onWheelZoom"
      >
        <v-layer>
          <v-image
            v-if="status === 'loaded'"
            ref="imageRef"
            :config="{
              image: image,
              x: imageSize.x,
              y: imageSize.y,
              offsetX: props.photo.width / 2,
              offsetY: props.photo.height / 2,
              rotation: imageDegrees,
              scaleX: imageScale,
              scaleY: imageScale,
              draggable: isImageDraggable,
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
        <button @click="handleRotate(-90)">
          <NuxtImg src="/products/format/rotate-left.svg" width="30" />
        </button>
        <button @click="handleRotate(90)">
          <NuxtImg src="/products/format/rotate-right.svg" width="30" />
        </button>
      </div>
      <input
        type="range"
        :min="imageSize.scale"
        :max="maxImageScale"
        step="0.01"
        v-model.number="imageScale"
        @input="handleScaleChange"
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
