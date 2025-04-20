<script setup lang="ts">
import type { Product } from "~/repository/products";

const { $api } = useNuxtApp();
const { data: products } = await useAsyncData<Product[]>("products", () =>
  $api.products.all()
);

// Группируем товары по категориям
const groupedProducts = computed(() => {
  if (!products.value) return {};

  return products.value.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category]!.push(product); //сделать проверку наличия
    return acc;
  }, {});
});

// Получаем уникальные категории для вывода заголовков
const categories = computed(() => {
  return Object.keys(groupedProducts.value);
});
</script>

<template>
  <div class="products-page">
    <h1 class="page-title">Наши товары</h1>

    <div
      v-for="category in categories"
      :key="category"
      class="category-section"
    >
      <h2 class="category-title">{{ category }}</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in groupedProducts[category]"
          :key="product.id"
          :product="product"
          class="product-card"
          @add-to-cart="$emit('add-to-cart', product)"
          @open-details="$emit('open-details', product)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
