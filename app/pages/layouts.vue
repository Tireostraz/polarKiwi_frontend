<template>
  <div class="container">
    <h1>Шаблоны макетов</h1>

    <div v-if="isLoading" class="loading">Загрузка шаблонов...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else class="layouts-grid">
      <div
        v-for="layoutItem in layoutItems"
        :key="layoutItem.id"
        class="layout-item"
      >
        <h2>
          {{ layoutItem.name }} ({{
            layoutItem.type === "cover" ? "Обложка" : "Страница"
          }})
        </h2>
        <div class="preview-container">
          <ConstructorRenderer
            v-if="layoutItem.data"
            :template-data="layoutItem.data"
            :width="400"
            :height="600"
          />
          <div v-else>Нет данных для отображения</div>
        </div>
        <button @click="selectLayout(layoutItem)">Выбрать этот шаблон</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Layout {
  id: string;
  name: string;
  type: "cover" | "page";
  preview_url: string;
  data: string | null;
}

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
//const layoutItems = ref<Layout[] | undefined>([]);
const { $api } = useNuxtApp();

const { data: layoutItems } = useAsyncData("/layouts", () =>
  $api.layouts.all()
);

const resp = await $api.layouts.all();
console.log(resp);

const selectLayout = (layout: Layout) => {
  console.log("Выбран шаблон:", layout);
  // Логика выбора шаблона
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
}

.error {
  color: red;
}

.layouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.layout-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
}

.preview-container {
  margin: 15px 0;
  border: 1px dashed #ccc;
  padding: 10px;
  min-height: 600px;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #369f6e;
}
</style>
