<template>
  <div class="text-toolbar">
    <!-- Настройки текста -->
    <label>
      Шрифт:
      <select v-model="node.attrs.fontFamily">
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </select>
    </label>

    <label>
      Размер:
      <input type="number" v-model.number="node.attrs.fontSize" />
    </label>

    <label>
      Жирный:
      <input type="checkbox" v-model="bold" />
    </label>

    <!-- Выравнивание -->
    <div class="align-buttons">
      <button @click="alignLeft">↤ Влево</button>
      <button @click="alignCenter">⇆ Центр</button>
      <button @click="alignRight">↦ Вправо</button>
      <button @click="alignTop">⇡ Верх</button>
      <button @click="alignMiddle">⇅ Центр</button>
      <button @click="alignBottom">⇣ Низ</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedTextNode: any;
}>();

const node = props.selectedTextNode;

const bold = computed({
  get: () => node.attrs.fontStyle === "bold",
  set: (val) => {
    node.attrs.fontStyle = val ? "bold" : "normal";
  },
});

// Размеры канваса (можно также передать как пропс при необходимости)
const canvasWidth = 800;
const canvasHeight = 600;

// Выравнивание по горизонтали
function alignLeft() {
  node.attrs.x = 0;
}
function alignCenter() {
  const width = node.attrs.width ?? getNodeWidth();
  node.attrs.x = (canvasWidth - width) / 2;
}
function alignRight() {
  const width = node.attrs.width ?? getNodeWidth();
  node.attrs.x = canvasWidth - width;
}

// Выравнивание по вертикали
function alignTop() {
  node.attrs.y = 0;
}
function alignMiddle() {
  const height = node.attrs.height ?? getNodeHeight();
  node.attrs.y = (canvasHeight - height) / 2;
}
function alignBottom() {
  const height = node.attrs.height ?? getNodeHeight();
  node.attrs.y = canvasHeight - height;
}

// Вспомогательные методы
function getNodeWidth() {
  if (node.attrs.width) return node.attrs.width;
  const text = node.attrs.text || "";
  const fontSize = node.attrs.fontSize || 24;
  return text.length * (fontSize / 2); // простая оценка ширины текста
}

function getNodeHeight() {
  if (node.attrs.height) return node.attrs.height;
  return node.attrs.fontSize || 24;
}
</script>

<style scoped>
.text-toolbar {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.align-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
</style>
