<template>
  <div
    class="polaroid"
    @click="handleClick"
    @drop.prevent="onDrop"
    @dragover.prevent
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

const onDrop = (e: DragEvent) => {
  const url = e.dataTransfer?.getData("text/plain");
  if (url) {
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
}

.polaroid__image img {
  width: 90%;
  height: 90%;
  object-fit: cover;
}

.polaroid__placeholder {
  font-size: 32px;
  color: #aaa;
}
</style>
