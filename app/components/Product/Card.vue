<script setup lang="ts">
import toast from "~/plugins/toast";
import type { Product } from "~/repository/products";

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(["add-to-cart", "open-details"]);

const projectsStore = useProjectsStore();

const addToProjects = () => {
  projectsStore.addProject(
    props.product.id,
    props.product.title,
    props.product.thumbnail,
    props.product.price
  );
  // Можно добавить уведомление об успешном добавлении
};
</script>

<template>
  <div class="product-card" @click="emit('open-details')">
    <div class="product-image-container">
      <NuxtImg
        :src="product.thumbnail"
        :alt="product.title"
        class="product-image"
      />
      <button class="quick-add-btn" @click.stop="addToProjects">
        <NuxtImg src="/add-to-cart.svg" width="20" />
      </button>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-description">{{ product.short_description }}</p>
      <div class="product-footer">
        <span class="product-price">{{ product.price }} ₽</span>
        <button class="details-btn" @click.stop="emit('open-details')">
          Подробнее
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  aspect-ratio: 1/1;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-add-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.quick-add-btn:hover {
  background: #ffb3b3;
}

.product-info {
  padding: 16px;
}

.product-title {
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.product-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-weight: 700;
  font-size: 1.1rem;
}

.details-btn {
  background: none;
  border: none;
  color: #6a1b9a;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.details-btn:hover {
  background: rgba(106, 27, 154, 0.1);
}
</style>
