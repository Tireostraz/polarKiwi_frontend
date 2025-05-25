<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Project } from "~/repository/projects";
import type { Product } from "~/repository/products";

const props = defineProps<{
  project: Project;
  product: Product;
}>();

const isDropdownMenuOpen = ref(false);
const isRenameModalOpen = ref(false);
const localeTitle = ref("");

const items: DropdownMenuItem[][] = [
  [
    {
      label: "Переименовать",
      icon: "i-lucide-case-sensitive",
      key: "rename",
      onSelect: () => {
        isRenameModalOpen.value = true;
        console.log("edit clicked");
      },
    },
    {
      label: "Дублировать",
      icon: "i-lucide-copy",
      key: "duplicate",
      onSelect: () => {
        handleDuplicate();
      },
    },
    {
      label: "Редактировать",
      icon: "i-lucide-pencil",
      key: "edit",
      onSelect: () => {
        handleClick();
      },
    },
  ],
  [
    {
      label: "Удалить",
      color: "error",
      icon: "i-lucide-trash",
      key: "delete",
      onClick: () => {
        handleRemove();
      },
    },
  ],
];

const router = useRouter();
const projects = useProjectsStore();

const handleClick = () => {
  router.push(`/projects/${props.project.id}`);
};

const handleRemove = () => {
  projects.removeProject(props.project.id);
};

const handleDuplicate = () => {
  projects.duplicateProject(props.project);
};

const confirmRename = () => {
  projects.renameProject(localeTitle.value, props.project.id);
  localeTitle.value = "";
  isRenameModalOpen.value = false;
};
</script>

<template>
  <div class="project-card" @click="handleClick">
    <div class="project-btn-wrapper" @click.stop>
      <UDropdownMenu
        v-model:open="isDropdownMenuOpen"
        :items="items"
        :ui="{ content: 'w-48' }"
      >
        <UButton color="neutral" variant="outline" icon="i-lucide-menu" />
      </UDropdownMenu>
    </div>
    <NuxtImg
      :src="product?.thumbnail"
      :alt="project.title"
      class="project-image"
    />
    <div class="project-content">
      <h3 class="project-title">{{ props.project.title || "Без названия" }}</h3>
      <p class="project-description">
        {{ product?.short_description || "Нет описания" }}
      </p>
      <div class="project-meta">
        <span class="project-type"> {{ product?.price }}₽ за фото </span>
      </div>
    </div>
  </div>

  <UModal
    v-model:open="isRenameModalOpen"
    title="Title"
    description="Description"
  >
    <template #content>
      <div class="p-4 space-y-4">
        <h3 class="text-lg font-bold">Переименовать проект</h3>
        <UInput
          v-model:model-value="localeTitle"
          placeholder="Новое название"
        />
        <div class="flex justify-end gap-2">
          <UButton color="success" @click="confirmRename">Сохранить</UButton>
          <UButton color="neutral" @click="isRenameModalOpen = false"
            >Отмена</UButton
          >
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.project-card {
  position: relative;
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
.project-btn-wrapper {
  position: absolute;
  top: 8px;
  right: 8px;
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
</style>
