<script setup lang="ts">
const props = defineProps<{
  imageUrl?: string;
  index: number;
}>();
const dropedImage = ref<string>("");
const isDragOver = ref(false);

const image = computed(() => {
  return props.imageUrl || dropedImage.value;
});

const handleClick = () => {
  console.log("clicked");
};

const onDragOver = (e: DragEvent) => {
  if (!image.value) {
    e.preventDefault();
    isDragOver.value = true;
    e.dataTransfer!.dropEffect = "copy";
  } else {
    e.dataTransfer!.dropEffect = "none";
  }
};

const onDrop = (e: DragEvent) => {
  if (image.value) return;

  isDragOver.value = false;
  const url = e.dataTransfer?.getData("text/plain");
  if (url) {
    dropedImage.value = url;
    isDragOver.value = false;
  }
};
</script>

<template>
  <div
    class="polaroid"
    :class="{ 'drop-zone': isDragOver && !image }"
    @click="handleClick"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
    @dragleave="isDragOver = false"
  >
    <div v-if="image" class="polaroid__image-wrapper">
      <NuxtImg
        :src="image"
        class="polaroid__image"
        provider="ipx"
        loading="lazy"
        draggable="false"
      />
    </div>
    <div v-else class="polaroid__placeholder">+</div>
    <div class="polaroid-count">{{ index + 1 }}</div>
  </div>
</template>

<style scoped>
.polaroid {
  width: 100%;
  max-width: 170px;
  height: auto;
  aspect-ratio: 5/6;
  background: white;
  padding: 15px 15px 40px 15px; /* Больше padding снизу для эффекта полароида */
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.polaroid__image-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.polaroid__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #f0f0f0;
}

.polaroid__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  font-size: 48px;
  color: #ffffff;
}

.polaroid.drop-zone {
  border: 2px dashed #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.polaroid.drop-zone .polaroid__placeholder {
  background: #a9efab;
  color: #4caf50;
}

.polaroid-count {
  position: absolute;
  bottom: -25px;
}
</style>
