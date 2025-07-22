<script setup lang="ts">
import type { Page, PageDefinition } from "~/repository/definitions";

const props = defineProps<{
  page: Page;
  pageDefinition?: PageDefinition;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scale = ref(1);

onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    if (!containerRef.value || !width.value || !height.value) return;

    const { clientWidth, clientHeight } = containerRef.value;
    const ratioX = clientWidth / width.value;
    const ratioY = clientHeight / height.value;
    scale.value = Math.min(ratioX, ratioY);
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

const DPI = 300;
const width = computed(() =>
  props.pageDefinition ? dmmToPx(props.pageDefinition.widthDmm, DPI) : 0
);

const height = computed(() =>
  props.pageDefinition ? dmmToPx(props.pageDefinition.heightDmm, DPI) : 0
);

const handleInfoClick = () => {
  console.log("Page: ", props.page);
  console.log("Definitions: ", props.pageDefinition);
};
</script>
<template>
  <div
    class="PlaceholderLayout"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div class="w-[200px] h-[200px] bg-amber-600"></div>
    <div class="w-[200px] h-[200px] bg-green-400"></div>
    <UButton color="info" @click="handleInfoClick">Info</UButton>
  </div>
</template>

<style scoped>
.PlaceholderLayout {
  display: flex;
  flex-direction: column;
}
</style>
