<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const tabs = [
  { name: "Фото Polaroid", path: "/products/polaroid" },
  { name: "Смсбуки", path: "/products/smsbook" },
  { name: "Постеры", path: "/products/poster" },
  { name: "Love is...", path: "/products/photos" },
  { name: "Подарочные наборы", path: "/products/magazines" },
];

const activeIndex = ref(-1); // Начальное значение -1 (ничего не активно)

watch(
  () => route.path,
  (newPath) => {
    // Если мы на главной странице, сбрасываем активный индекс
    if (newPath === "/") {
      activeIndex.value = -1;
    } else {
      // Иначе ищем соответствующую вкладку
      const foundIndex = tabs.findIndex((t) => newPath.startsWith(t.path));
      activeIndex.value = foundIndex;
    }
  },
  { immediate: true }
);

const isOnHomePage = computed(() => route.path === "/");

function navigateTo(index: number) {
  // Если мы на главной странице, добавляем класс для анимации перед переходом
  if (isOnHomePage.value) {
    const slider = document.querySelector(".main-slider");
    if (slider) {
      slider.classList.add("slider--collapsing");
      // Ждем небольшое время, чтобы анимация началась перед переходом
      setTimeout(() => {
        activeIndex.value = index;
        router.push(tabs[index]!.path);
      }, 50);
      return;
    }
  }
  activeIndex.value = index;
  router.push(tabs[index]!.path);
}
</script>

<template>
  <div class="tabs-nav">
    <div class="tabs-container">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.path"
        :class="['tab-button', { active: index === activeIndex }]"
        @click="navigateTo(index)"
      >
        {{ tab.name }}
      </button>
    </div>
  </div>
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
  transition: color 0.3s, border-bottom 0.3s;
  border-bottom: 2px solid transparent;
  color: #444;
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
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
  }
}

/* Слайдер-уменьшение */
.main-slider.slider--collapsing {
  height: 200px !important;
  transition: height 0.5s ease;
}
</style>
