<template>
  <div class="project-card">
    <img
      :src="project.preview"
      :alt="project.name || 'Превью проекта'"
      class="project-image"
    />
    <div class="project-content">
      <h3 class="project-title">{{ project.name || "Без названия" }}</h3>
      <p class="project-description">
        {{ project.description || "Нет описания" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  project: {
    id: string | number;
    name?: string;
    description?: string;
    preview: string;
    productSlug: string;
  };
}>();

const router = useRouter();
</script>

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
</style>
