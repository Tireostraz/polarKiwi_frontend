<script setup lang="ts">
import type { Product } from "~/repository/products";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  product: Product;
}>();

const open = ref(false);

defineShortcuts({
  o: () => (open.value = !open.value),
});

const items: DropdownMenuItem[][] = [
  [
    {
      label: "View",
      icon: "i-lucide-eye",
    },
    {
      label: "Copy",
      icon: "i-lucide-copy",
    },
    {
      label: "Edit",
      icon: "i-lucide-pencil",
    },
  ],
  [
    {
      label: "Delete",
      color: "error",
      icon: "i-lucide-trash",
    },
  ],
];

const router = useRouter();
const projects = useProjectsStore();

const handleClick = () => {
  router.push(`/projects/${props.product.slug}`);
};

const handleRemove = (e: MouseEvent) => {
  projects.removeProject(props.product.id);
};
</script>

<template>
  <div class="project-card" @click="handleClick">
    <!-- <button class="remove-btn" @click.stop="handleRemove">×</button> -->
    <UDropdownMenu v-model:open="open" :items="items" :ui="{ content: 'w-48' }">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-menu"
        @click.stop=""
      />
    </UDropdownMenu>
    <img :src="product.thumbnail" :alt="product.title" class="project-image" />
    <div class="project-content">
      <h3 class="project-title">{{ product.title || "Без названия" }}</h3>
      <p class="project-description">
        {{ product.short_description || "Нет описания" }}
      </p>
      <div class="project-meta">
        <span class="project-type">
          {{
            product.category === "polaroid"
              ? "Полароид"
              : product.category === "smsbook"
              ? "SMS-книга"
              : "Проект"
          }}
        </span>
      </div>
    </div>
  </div>
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

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #ffdddd;
}
</style>
