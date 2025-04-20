<template>
  <div
    class="polaroid"
    :class="{ 'drop-zone': isDragOver }"
    @click="handleClick"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
  >
    <div v-if="imageUrl" class="polaroid__image">
      <img :src="imageUrl" />
    </div>
    <div v-else class="polaroid__placeholder">+</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageUrl?: string;
  index: number;
}>();
const emit = defineEmits(["edit", "drop"]);

const handleClick = () => {
  emit("edit");
};

const isDragOver = ref(false);

const onDragEnter = (e: DragEvent) => {
  if (!props.imageUrl) {
    isDragOver.value = true;
    e.dataTransfer!.dropEffect = "copy";
  } else {
    e.dataTransfer!.dropEffect = "none";
  }
};

const onDragOver = (e: DragEvent) => {
  if (!props.imageUrl) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "copy";
  } else {
    e.dataTransfer!.dropEffect = "none";
  }
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const url = e.dataTransfer?.getData("text/plain");
  if (url && !props.imageUrl) {
    emit("drop", { index: props.index, url });
  }
};
</script>

<style scoped>
.polaroid {
  width: 160px;
  height: 200px;
  background: white;
  border: 4px solid #eee;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.polaroid.drop-zone {
  border: 4px dashed #2e7d32;
  background-color: rgba(46, 125, 50, 0.1);
}

.polaroid__image img {
  width: 90%;
  height: 90%;
  object-fit: cover;
}
.polaroid:not(.drop-zone)[dragover] {
  cursor: no-drop;
}

.polaroid.drop-zone {
  cursor: copy;
}

.polaroid__placeholder {
  font-size: 32px;
  color: #aaa;
  transition: all 0.2s;
}

.polaroid.drop-zone .polaroid__placeholder {
  transform: scale(1.2);
  color: #2e7d32;
}
</style>
