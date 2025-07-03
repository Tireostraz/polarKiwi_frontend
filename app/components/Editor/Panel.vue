<script setup lang="ts">
defineProps<{
  projectId: string;
}>();

const isOpen = ref(false);
const isAutoPlacing = ref(false);

const handleOpenModal = () => {
  isOpen.value = !isOpen.value;
};
</script>
<template>
  <div class="w-[200px]">
    <UButton @click="handleOpenModal">Click</UButton>

    <EditorUploaderModal
      :project-id="projectId"
      :isauto-placing="isAutoPlacing"
      :is-open="isOpen"
    />
  </div>
</template>
