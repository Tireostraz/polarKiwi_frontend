<template>
  <div class="popup book-photo-editor-modal" :class="{ 'popup--open': isOpen }">
    <div
      class="popup__overlay"
      @click="close"
      aria-label="overlay"
      role="button"
      tabindex="0"
    ></div>
    <div class="popup__dialog">
      <div class="popup__content">
        <div class="book-photo-editor-modal__header">
          <button type="button" @click="close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <p>Редактор фото</p>
          <button type="button" @click="save">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div class="book-photo-editor">
          <div class="book-photo-editor__photo">
            <div class="crop-container">
              <img
                :src="imageUrl"
                alt="Изображение для редактирования"
                class="crop-image"
                :style="{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }"
              />
            </div>
          </div>
          <div class="book-photo-editor__tools">
            <div class="editor-tools__controls">
              <div class="editor-tools__slider">
                <div class="editor-tools__slider-title">Масштаб</div>
                <div class="scale-slider__wrapper">
                  <button class="control-button" type="button" @click="zoomOut">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 12h14"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    v-model="zoom"
                    class="slider"
                  />
                  <button class="control-button" type="button" @click="zoomIn">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="editor-tools__controls-photo">
                <div class="edit-actions">
                  <div class="edit-actions__btn-wrapper">
                    <button
                      type="button"
                      class="edit-actions__btn edit-actions__btn--rotate"
                      @click="rotate(-90)"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                          stroke-width="2"
                        />
                        <circle cx="12" cy="12" r="3" stroke-width="2" />
                      </svg>
                    </button>
                    <span>Повернуть влево</span>
                  </div>
                  <div class="edit-actions__btn-wrapper">
                    <button
                      type="button"
                      class="edit-actions__btn edit-actions__btn--rotate"
                      @click="rotate(90)"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M22 12s-3-7-10-7-10 7-10 7 3 7 10 7 10-7 10-7z"
                          stroke-width="2"
                        />
                        <circle cx="12" cy="12" r="3" stroke-width="2" />
                      </svg>
                    </button>
                    <span>Повернуть вправо</span>
                  </div>
                  <div class="edit-actions__btn-wrapper">
                    <button
                      type="button"
                      class="edit-actions__btn"
                      @click="$emit('replace')"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M4 16l4-4 4 4M12 8v8M20 8l-4 4-4-4"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                    <span>Заменить</span>
                  </div>
                  <div class="edit-actions__btn-wrapper">
                    <button
                      type="button"
                      class="edit-actions__btn"
                      @click="$emit('remove')"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                          stroke-width="2"
                        />
                      </svg>
                    </button>
                    <span>Удалить</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  isOpen: boolean;
  imageUrl: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "save", "replace", "remove"]);

const zoom = ref(1);
const rotation = ref(0);

const zoomIn = () => {
  if (zoom.value < 3) zoom.value += 0.1;
};

const zoomOut = () => {
  if (zoom.value > 1) zoom.value -= 0.1;
};

const rotate = (degrees: number) => {
  rotation.value += degrees;
};

const close = () => {
  emit("close");
};

const save = () => {
  emit("save", {
    zoom: zoom.value,
    rotation: rotation.value,
  });
  close();
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.popup--open {
  opacity: 1;
  visibility: visible;
}

.popup__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup__dialog {
  position: relative;
  width: 90%;
  max-width: 800px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.popup--open .popup__dialog {
  transform: translateY(0);
}

.popup__content {
  overflow-y: auto;
  flex-grow: 1;
}

.book-photo-editor-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #333;
  color: white;
}

.book-photo-editor-modal__header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.book-photo-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-photo-editor__photo {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.crop-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.crop-image {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
}

.editor-tools__controls {
  padding: 20px;
  border-top: 1px solid #eee;
}

.editor-tools__slider {
  margin-bottom: 20px;
}

.editor-tools__slider-title {
  margin-bottom: 8px;
  font-weight: 500;
}

.scale-slider__wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  flex-grow: 1;
}

.control-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.edit-actions {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
}

.edit-actions__btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.edit-actions__btn {
  background: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.edit-actions__btn svg {
  width: 20px;
  height: 20px;
}

.edit-actions__btn-wrapper span {
  font-size: 12px;
  color: #666;
}
</style>
