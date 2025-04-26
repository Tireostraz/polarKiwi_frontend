<template>
  <div>
    <div class="toolbar">
      <button @click="addPlaceholder">Добавить плейсхолдер</button>
      <button @click="saveTemplate">Сохранить шаблон</button>
      <button @click="addText">Добавить текст</button>
    </div>

    <TemplateTextToolbar
      v-if="selectedTextNode"
      :selected-text-node="selectedTextNode"
    />

    <TemplateEditorCanvas
      :settings="settings"
      :nodes="nodes"
      @select-node="handleSelectNode"
    />
  </div>
</template>

<script setup lang="ts">
const selectedTextNode = ref<any | null>(null);

const settings = ref({
  width: 800,
  height: 600,
  type: "page",
});

const nodes = ref<{ type: string; attrs: Record<string, any> }[]>([]);

function addPlaceholder() {
  nodes.value.push({
    type: "rect",
    attrs: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: "#ccc",
      draggable: true,
    },
  });
}

function handleSelectNode(node: any) {
  selectedTextNode.value = { ...node };
}

function addText() {
  nodes.value.push({
    type: "text",
    attrs: {
      x: 100,
      y: 100,
      text: "Пример текста",
      fontSize: 24,
      fill: "black",
      draggable: true,
      fontStyle: "normal",
      fontFamily: "Arial",
    },
  });
}

function saveTemplate() {
  const json = JSON.stringify(nodes.value, null, 2);
  console.log("Сохранённый JSON шаблона:", json);
  alert("Шаблон сохранён! Посмотри консоль.");
}

function handleSelectText(node: any) {
  selectedTextNode.value = node;
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>
