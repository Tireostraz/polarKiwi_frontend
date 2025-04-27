<script setup lang="ts">
import { useImage } from "vue-konva";

const props = defineProps<{
  src: string;
}>();

const emit = defineEmits<{
  (e: "save", newSrc: string): void;
  (e: "delete"): void;
  (e: "close"): void;
}>();

const imageObj = useImage(props.src); // только imageObj

const stageRef = ref();
const imageRef = ref();
const transformerRef = ref();
const isLoading = ref(true);

watch(
  () => props.src,
  () => {
    isLoading.value = true;
  }
);

function onImageLoad() {
  isLoading.value = false;
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
</script>

<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-content">
      <div v-if="isLoading" class="loading">Загрузка...</div>
      <v-stage
        ref="stageRef"
        v-if="!isLoading"
        :config="{ width: 500, height: 500 }"
      >
        <v-layer>
          <v-image
            ref="imageRef"
            :config="{
              image: imageObj,
              x: 0,
              y: 0,
              draggable: true,
            }"
            @load="onImageLoad"
          />
          <v-transformer
            ref="transformerRef"
            :config="{
              rotateEnabled: true,
              enabledAnchors: [
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
              ],
              boundBoxFunc: (oldBox: any, newBox: any) => newBox,
            }"
          />
        </v-layer>
      </v-stage>

      <div class="modal-actions">
        <button @click="handleSave" class="btn green">Сохранить</button>
        <button @click="handleDelete" class="btn red">Удалить</button>
        <button @click="handleClose" class="btn">Закрыть</button>
      </div>
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
  min-width: 550px;
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
