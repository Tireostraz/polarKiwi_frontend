<template>
  <div class="mb-4 space-y-2">
    <div>
      <label>Тип шаблона:</label>
      <select v-model="localSettings.type" class="border p-1 ml-2">
        <option value="page">Страница</option>
        <option value="cover">Обложка</option>
      </select>
    </div>
    <div>
      <label>Размеры (px):</label>
      <input
        type="number"
        v-model.number="localSettings.width"
        class="border p-1 w-20 ml-2"
        placeholder="Ширина"
      />
      <input
        type="number"
        v-model.number="localSettings.height"
        class="border p-1 w-20 ml-2"
        placeholder="Высота"
      />
    </div>
    <button
      @click="emitUpdate"
      class="bg-blue-500 text-white px-3 py-1 rounded"
    >
      Применить
    </button>
    <button
      @click="$emit('add-placeholder')"
      class="ml-2 bg-gray-500 text-white px-3 py-1 rounded"
    >
      Добавить Placeholder
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update-settings", "add-placeholder"]);

const localSettings = reactive({
  type: "page",
  width: 600,
  height: 800,
});

function emitUpdate() {
  emit("update-settings", { ...localSettings });
}
</script>
