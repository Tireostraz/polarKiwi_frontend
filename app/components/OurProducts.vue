<script setup lang="ts">
interface Product {
  id: number;
  link: string;
  image: string;
  title: string;
}

const products: Product[] = [
  {
    id: 1,
    link: "/products/polaroid",
    image: "products/our_products/polaroids.jpg",
    title: "Фото полароид",
  },
  {
    id: 2,
    link: "/products/smsbook",
    image: "products/our_products/smsbooks.jpg",
    title: "Смсбуки",
  },
  {
    id: 3,
    link: "/products/polaroid",
    image: "products/our_products/love_is.jpg",
    title: "Love is...",
  },
  {
    id: 4,
    link: "/products/poster",
    image: "products/our_products/posters.jpg",
    title: "Постеры",
  },
  {
    id: 5,
    link: "/products/albums",
    image: "products/our_products/albums.jpg",
    title: "Альбомы",
  },
  {
    id: 6,
    link: "/products/date_cards",
    image: "products/our_products/date_cards.jpg",
    title: "Карточки свиданий",
  },
  {
    id: 7,
    link: "/products/laminated",
    image: "products/our_products/laminated.jpg",
    title: "Фото под чехол",
  },
  {
    id: 8,
    link: "/products",
    image: "products/our_products/all.jpg",
    title: "Все товары",
  },
];
</script>

<template>
  <div class="products-container">
    <nuxt-link v-for="product in products" :to="product.link" class="product">
      <div class="image-wrapper">
        <div class="product-text">{{ product.title }}</div>
        <NuxtImg :src="product.image" class="product-image" />
      </div>
    </nuxt-link>
  </div>
</template>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.product {
  display: flex;
  flex-direction: column;
  position: relative;
  text-decoration: none;
  color: white;
  border-radius: 5%;
}
.product:hover {
  transition: transform 1s ease, box-shadow 0.5s ease;
  transform: translateY(-5%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}
.image-wrapper {
  padding-top: 56.25%;
  position: relative;
}
.product-text {
  position: absolute;
  z-index: 10;
  font-size: 1.5rem;
  top: 10%;
  left: 5%;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  object-position: center;
  border-radius: 3%;
  width: 100%;
  height: 100%;
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .products-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 15px;
    padding-bottom: 15px; /* Для скролла */
    -webkit-overflow-scrolling: touch; /* Плавный скролл на iOS */
  }

  .product {
    scroll-snap-align: start;
    flex: 0 0 75%; /* Ширина карточки 75% от ширины экрана */
    min-width: 0; /* Фикс для flex-элементов */
  }

  .image-wrapper {
    padding-top: 100%; /* Квадратные карточки на мобильных */
  }

  /* Скрыть scrollbar в некоторых браузерах */
  .products-scroll-wrapper::-webkit-scrollbar {
    display: none;
  }
  .products-scroll-wrapper {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Дополнительные адаптивные стили */
@media (max-width: 480px) {
  .product {
    flex: 0 0 85%; /* Чуть шире карточки на очень маленьких экранах */
  }

  .product-title {
    font-size: 1rem;
  }

  .product-price {
    font-size: 0.9rem;
  }
}
</style>
