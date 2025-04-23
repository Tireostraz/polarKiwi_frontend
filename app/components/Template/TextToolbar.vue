<template>
  <div v-if="selectedTextNode" class="text-toolbar">
    <label
      >Шрифт:
      <select v-model="selectedTextNode.attrs.fontFamily">
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </select>
    </label>
    <label
      >Размер:
      <input type="number" v-model.number="selectedTextNode.attrs.fontSize" />
    </label>
    <label
      >Жирный:
      <input type="checkbox" v-model="bold" />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedTextNode: any;
}>();

const bold = computed({
  get: () => props.selectedTextNode.attrs.fontStyle === "bold",
  set: (val) => {
    props.selectedTextNode.attrs.fontStyle = val ? "bold" : "normal";
  },
});
</script>

<style scoped>
.text-toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
