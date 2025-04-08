<script setup lang="ts">
interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  link: string;
}

const products: Product[] = [
  {
    id: "1",
    image: "products/1.jpg",
    title: "Подарочные сертификаты",
    price: "от 1390 ₽",
    link: "/products/gift",
  },
  {
    id: "2",
    image: "products/2.jpg",
    title: "Соберем фотокнигу за вас",
    price: "от 1 490 ₽",
    link: "/design-photobook",
  },
  {
    id: "3",
    image: "products/3.jpg",
    title: "Вертикальная фотокнига",
    price: "от 3 990 ₽",
    link: "/products/photobooks/hardbook-photo-vertical",
  },
  {
    id: "4",
    image: "products/4.jpg",
    title: "Полароидные снимки и открытки",
    price: "1 790 ₽",
    link: "/products/prints/",
  },
  {
    id: "5",
    image: "products/5.jpg",
    title: "Минибук",
    price: "2 190 ₽",
    link: "/products/photobooks/minibook",
  },
  {
    id: "6",
    image: "",
    title: "Все продукты",
    price: "",
    link: "/products",
  },
];
</script>

<template>
  <div class="products-container">
    <nuxt-link
      v-for="product in products"
      :key="product.id"
      :to="product.link"
      class="product"
      :class="{ 'all-products': !product.image }"
    >
      <div class="image-wrapper">
        <NuxtImg
          v-if="product.image"
          :src="product.image"
          class="product-image"
          :alt="product.title"
          loading="lazy"
        />
        <div v-else class="stub-image"></div>
      </div>
      <div class="product-meta">
        <h3 class="product-title">{{ product.title }}</h3>
        <div v-if="product.price" class="product-price">
          {{ product.price }}
        </div>
        <img
          v-if="!product.image"
          src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0nc3Ryb2tlLWNvbG9yJyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjY2NjcgOC4zMzMyNUwzMy4zMzM0IDI0Ljk5OTlMMTYuNjY2NyA0MS42NjY2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+Cjwvc3ZnPgo="
          alt="перейти"
          class="arrow-icon"
        />
      </div>
    </nuxt-link>
  </div>
</template>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  padding-top: 75%; /* Соотношение сторон 4:3 */
  background-color: #f5f5f5;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.stub-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}

.product-meta {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.all-products .product-meta {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.product-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 500;
}

.product-price {
  font-size: 1rem;
  color: #666;
  margin-top: auto;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .products-container {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .product-title {
    font-size: 0.9rem;
  }

  .product-price {
    font-size: 0.8rem;
  }
}
</style>
