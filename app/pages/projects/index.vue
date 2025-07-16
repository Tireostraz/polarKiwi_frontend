<script setup lang="ts">
import type { Project } from "~/repository/projects";
const { $api } = useNuxtApp();
const router = useRouter();

const { data, status } = await useAsyncData<Project[]>(
  "projects",
  () => $api.projects.drafts(),
  { server: false }
);

const goToCreate = () => {
  router.push("/products");
};
</script>

<template>
  <div class="projects-container">
    <h2 class="page-title">Мои проекты</h2>
    <div class="projects-grid">
      <div class="project-card add-new-card" @click="goToCreate">
        <div class="add-icon">+</div>
        <p class="add-text">Добавить новый проект</p>
      </div>
      <!-- Пока данные грузятся, показываем заглушки -->
      <template v-if="status !== 'success'">
        <ProjectSkeleton v-for="i in 3" :key="'skeleton-' + i" />
      </template>

      <!-- После загрузки — рендерим проекты -->
      <template v-else>
        <ProjectCard
          v-for="project in data"
          :key="project.id"
          :project="project"
        />
        <p v-if="data?.length === 0" class="empty-text">
          У вас пока нет проектов.
        </p>
      </template>
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
