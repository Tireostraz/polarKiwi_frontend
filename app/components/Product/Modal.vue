<script setup lang="ts">
import type { Product } from "~/repository/products";

const props = defineProps<{
  product: Product | null;
  isOpen: boolean;
}>();

const currentImageIndex = ref(0);

const currentOpenImage = computed(() => {
  return props.product?.images?.[currentImageIndex.value];
});

const emit = defineEmits(["close", "add-to-cart"]);

const cartStore = useCartStore();

function addToCart(e: Event) {
  e.preventDefault();
  if (props.product) {
    cartStore.addToCart(props.product);
    emit("add-to-cart", props.product);
  }
}

function setCurrentImage(index: number) {
  currentImageIndex.value = index;
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      currentImageIndex.value = 0;
    }
  }
);
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-container">
      <button class="close-btn" @click="emit('close')">
        <img name="mdi:close" size="24" />
      </button>

      <div class="modal-content">
        <div class="modal-gallery">
          <div class="main-image">
            <NuxtImg
              :src="currentOpenImage"
              :alt="product?.title"
              class="product-image"
            />
          </div>
          <div class="thumbnails">
            <div
              v-for="(image, index) in product?.images"
              :key="index"
              class="thumbnail"
              @click="setCurrentImage(index)"
            >
              <NuxtImg
                :src="image"
                :alt="`${product?.title} ${index + 1}`"
                class="thumbnail-image"
              />
            </div>
          </div>
        </div>

        <div class="modal-info">
          <h2 class="modal-title">{{ product?.title }}</h2>
          <div class="modal-price">{{ product?.price }} ₽</div>
          <div class="modal-description">
            <p>{{ product?.full_description }}</p>
          </div>

          <div class="modal-actions">
            <button class="add-to-cart-btn" @click.stop.prevent="addToCart">
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: fadeIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.modal-gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-image {
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid #eee;
}

.thumbnail:hover {
  border-color: #6a1b9a;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6a1b9a;
}

.modal-description {
  line-height: 1.6;
}

.add-to-cart-btn {
  background: #6a1b9a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.add-to-cart-btn:hover {
  background: #5a148a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .modal-content {
    flex-direction: row;
  }

  .modal-gallery {
    width: 60%;
  }

  .modal-info {
    width: 40%;
  }
}
</style>
