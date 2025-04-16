<script setup lang="ts">
import type { Product } from "~/repository/products";

const route = useRoute();
const { $api } = useNuxtApp();

const category = computed(() => route.params.category as string);

const {
  data: products,
  status,
  error,
} = await useAsyncData(
  `products-${category.value}`, // уникальный ключ
  () => $api.products.byCategory(category.value)
);

const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);

function openModal(product: Product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}
</script>

<template>
  <div class="products-page">
    <h1 class="page-title">{{ category }}</h1>

    <div v-if="status === 'pending'">Загрузка...</div>
    <div v-else-if="error">Ошибка загрузки товаров: {{ error.message }}</div>
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @open-details="openModal(product)"
      />
    </div>

    <ProductModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped>
.products-page {
  padding: 24px;
  max-width: 1280px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 32px;
  text-transform: capitalize;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>
