<template>
  <div class="print-item__item-wrapper print-item__item-wrapper--print">
    <div :id="itemId" class="print-item__item">
      <div
        class="product-item"
        role="button"
        tabindex="0"
        @click="handleItemClick"
      >
        <div class="product-item__page">
          <div class="layout-editor">
            <div class="layout-editor__wrapper">
              <div class="layout">
                <svg width="100%" height="100%" viewBox="0 0 227 306">
                  <g>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      width="227"
                      height="306"
                    >
                      <image
                        v-if="imageUrl"
                        width="217"
                        height="217"
                        x="22"
                        y="24"
                        preserveAspectRatio="xMidYMid slice"
                      />
                      <g v-else id="page-upload-icon" fill="transparent">
                        <circle
                          opacity="0.25"
                          cx="32"
                          cy="32"
                          r="31.5"
                          stroke="#5A5A5A"
                        ></circle>
                        <path
                          d="M32 41.0006L32 22.9994"
                          stroke="#5A5A5A"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                        <path
                          d="M41.0006 32L22.9994 32"
                          stroke="#5A5A5A"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </svg>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="print-item__item__num">
      <span role="button" tabindex="0">{{ index + 1 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageUrl?: string;
  index: number;
  itemCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits(["edit"]);

const itemId = computed(
  () => `print-item-${Math.random().toString(36).substr(2, 9)}`
);

const handleItemClick = () => {
  if (props.imageUrl) {
    emit("edit");
  }
};
</script>

<style scoped>
.print-item__item-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.print-item__photos-title {
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
}

.print-item__item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.product-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.product-item:hover {
  transform: scale(1.02);
}

.print-item__item__num {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 12px;
  color: #666;
}
</style>
