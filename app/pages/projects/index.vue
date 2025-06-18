<script setup lang="ts">
import type { Product } from "~/repository/products";
const { $api } = useNuxtApp();
const projects = useProjectsStore();
const authStore = useAuthStore();
const router = useRouter();

// Используем ref для управления состоянием загрузки
const isHydrated = authStore.isHydrated;
const isLoading = ref(false);

// Инициализируем данные
const productsData = ref<Product[]>([]);

// Функция загрузки данных
const loadData = async () => {
  try {
    isLoading.value = true;
    await projects.loadProjects();

    const productIds = [
      ...new Set(projects.addedProjects.map((p) => p.productId)),
    ];

    if (productIds.length > 0) {
      productsData.value = await $api.products.byIds(productIds);
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

// Загружаем данные при монтировании
onMounted(async () => {
  await loadData();
  /* isHydrated.value = true; */
});

const products = computed(() => productsData.value || []);

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
      <template v-if="!isHydrated || isLoading">
        <ProjectSkeleton v-for="i in 3" :key="'skeleton-' + i" />
      </template>

      <!-- После загрузки — рендерим проекты -->
      <template v-else>
        <ProjectCard
          v-for="project in projects.addedProjects"
          :key="project.id"
          :project="project"
          :product="products.find((p) => p.id === project.productId)!"
        />
        <p v-if="projects.totalProjects === 0" class="empty-text">
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
