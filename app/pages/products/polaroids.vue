<script setup lang="ts">
import type { Product } from "~/repository/cart";

const route = useRoute();
const category = computed(() => route.path.split("/").pop());

// В реальном приложении данные будут приходить из API
const products = ref<Product[]>([
  {
    id: "1",
    title: 'Polaroid "Весеннее настроение"',
    thumbnail: "/products/photos/polaroid-standard1.jpg",
    images: [
      "/products/photos/polaroid-standard1.jpg",
      "/products/photos/polaroid-standard2.jpg",
      "/products/photos/polaroid-standard3.jpg",
    ],
    price: 1200,
    shortDescription: "Яркий Polaroid с весенними цветами",
    fullDescription:
      "Прекрасный Polaroid с изображением весенних цветов. Идеально подходит для украшения интерьера или в качестве подарка. Размер: 10×15 см. Материал: глянцевая фотобумага.",
    category: "polaroids",
  },
  // Добавьте другие товары
]);

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

    <div class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @open-details="openModal(product)"
        @add-to-cart="useCartStore().addToCart(product)"
      />
    </div>

    <ProductModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @add-to-cart="useCartStore().addToCart(selectedProduct!)"
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
