<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const tabs = [
  { name: "Фото Polaroid", path: "/products/polaroids" },
  { name: "Смсбуки", path: "/products/smsbooks" },
  { name: "Постеры", path: "/products/posters" },
  { name: "Love is...", path: "/products/photos" },
  { name: "Журналы", path: "/products/magazines" },
];

const activeIndex = computed(() =>
  tabs.findIndex((tab) => route.path === tab.path)
);

function navigateTo(path: string) {
  if (route.path !== path) {
    router.push({ path });
  }
}
</script>

<template>
  <nav class="tabs-nav">
    <div class="tabs-container">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.path"
        :class="['tab-button', { active: index === activeIndex }]"
        @click="navigateTo(tab.path)"
      >
        {{ tab.name }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabs-nav {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 1rem;
  overflow-x: auto;
}

.tabs-container {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  color: #555;
}

.tab-button:hover {
  color: #6a1b9a;
}

.tab-button.active {
  border-bottom: 2px solid #6a1b9a;
  color: #6a1b9a;
  font-weight: 600;
}

@media (max-width: 768px) {
  .tabs-container {
    gap: 0.5rem;
  }
  .tab-button {
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
  }
}
</style>
