<script setup lang="ts">
import { UButton } from "#components";

const { $api } = useNuxtApp();
const projects = useProjectsStore();

const {
  data: products,
  status,
  error,
} = await useAsyncData(
  `/products-${projects.addedProjectsIds}`,
  () => $api.products.byIds(projects.addedProjectsIds),
  {
    watch: [() => projects.addedProjectsIds],
  }
);

const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
}

const router = useRouter();
const goToCreate = () => {
  router.push("/products");
};

function handleClick() {
  console.log(projects.addedProjectsIds, projects.projects);
}
</script>

<template>
  <div class="projects-container">
    <h2 class="page-title">Мои проекты</h2>
    <div class="projects-grid">
      <UButton color="info" @click="toggleTheme">
        Сменить тему ({{ colorMode.preference }})
      </UButton>
      <button @click="handleClick">Data</button>
      <div class="project-card add-new-card" @click="goToCreate">
        <div class="add-icon">+</div>
        <p class="add-text">Добавить новый проект</p>
      </div>
      <ProjectCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
      <p v-if="!products" class="empty-text">У вас пока нет проектов.</p>
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  padding: 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.empty-text {
  color: #777;
  font-size: 14px;
}

/* "Добавить новый проект" */
.add-new-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed #bbb;
  border-radius: 16px;
  height: 220px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafafa;
}

.add-new-card:hover {
  background-color: #f0f0f0;
}

.add-icon {
  font-size: 48px;
  color: #999;
  line-height: 1;
}

.add-text {
  margin-top: 12px;
  font-size: 16px;
  color: #666;
}
</style>
