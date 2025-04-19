<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Мои проекты</h2>
    <div
      v-if="projects.length"
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      <!-- <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      /> -->
    </div>
    <p v-else class="text-muted-foreground text-sm">У вас пока нет проектов.</p>
  </div>
</template>

<script setup lang="ts">
const projects = [
  {
    id: 1,
    name: "Polaroid Summer",
    preview: "/images/polaroid-preview.jpg",
    productSlug: "polaroid",
    description: "Полароидные воспоминания с лета",
  },
  {
    id: 2,
    name: "Семейная фотокнига",
    preview: "/images/photo-book-preview.jpg",
    productSlug: "photobook",
    description: "20 страниц счастья в одной книге",
  },
  {
    id: 3,
    name: "Смсбук маме",
    preview: "/images/smsbook-preview.jpg",
    productSlug: "smsbook",
    description: "Маленький, но душевный подарок",
  },
];
</script>
