<script setup lang="ts">
import type { Project } from "~/repository/projects";
import { computed } from "vue";

const props = defineProps<{
  project: Project;
}>();

const { $api } = useNuxtApp();

const router = useRouter();

// Получаем данные продукта из хранилища или API
const {
  data: products,
  status,
  error,
} = await useAsyncData(
  `/products/${category.value}`, // уникальный ключ
  () => $api.products.byId(category.value)
);

const projectTitle = computed(() => {
  return product.value?.title || "Без названия";
});

const projectDescription = computed(() => {
  return product.value?.short_description || "Нет описания";
});

const projectType = computed(() => {
  switch (props.project.type) {
    case "photo":
      return "Фотография";
    case "smsbook":
      return "SMS-книга";
    default:
      return "Проект";
  }
});

const formattedDate = computed(() => {
  return new Date(props.project.createdAt).toLocaleDateString();
});

const getPreviewImage = computed(() => {
  // Для фото проектов используем первое изображение, если есть
  if (props.project.type === "photo" && props.project.images?.length > 0) {
    return props.project.images[0].url;
  }
  // Для SMS-книг используем обложку
  if (props.project.type === "smsbook" && props.project.coverImage) {
    return props.project.coverImage;
  }
  // Если нет своих изображений, используем thumbnail продукта
  return product.value?.thumbnail || "/images/default-project.jpg";
});

const handleClick = () => {
  router.push(`/projects/${props.project.id}`);
};
</script>

<template>
  <div class="project-card" @click="handleClick">
    <img :src="getPreviewImage" :alt="projectTitle" class="project-image" />
    <div class="project-content">
      <h3 class="project-title">{{ projectTitle }}</h3>
      <p class="project-description">
        {{ projectDescription }}
      </p>
      <div class="project-meta">
        <span class="project-date">{{ formattedDate }}</span>
        <span class="project-type">{{ projectType }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  width: 100%;
  max-width: 320px;
  border: 1px solid #ccc;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.project-content {
  padding: 16px;
}

.project-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.project-description {
  margin: 8px 0 0;
  font-size: 14px;
  color: #666;
}

.project-meta {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.project-date,
.project-type {
  display: inline-block;
}
</style>
