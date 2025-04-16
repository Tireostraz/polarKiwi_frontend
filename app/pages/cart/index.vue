<script setup lang="ts">
import type { Product } from "~/repository/products";

const cartStore = useCartStore();

function increaseQuantity(item: { product: Product; quantity: number }) {
  cartStore.updateQuantity(item.product.id, item.quantity + 1);
}

function decreaseQuantity(item: { product: Product; quantity: number }) {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.product.id, item.quantity - 1);
  } else {
    cartStore.removeFromCart(item.product.id);
  }
}

function removeItem(productId: string) {
  cartStore.removeFromCart(productId);
}
</script>

<template>
  <div class="cart-page">
    <h1 class="page-title">Корзина</h1>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Ваша корзина пуста</p>
      <NuxtLink to="/" class="continue-shopping">Продолжить покупки</NuxtLink>
    </div>

    <div v-else class="cart-container">
      <div class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="cart-item"
        >
          <div class="item-image">
            <NuxtImg
              :src="item.product.thumbnail"
              :alt="item.product.title"
              class="product-image"
            />
          </div>

          <div class="item-details">
            <h3 class="item-title">{{ item.product.title }}</h3>
            <p class="item-description">{{ item.product.short_description }}</p>
            <div class="item-price">{{ item.product.price }} ₽</div>
          </div>

          <div class="item-quantity">
            <button
              class="quantity-btn"
              @click="decreaseQuantity(item)"
              :disabled="item.quantity <= 1"
            >
              −
            </button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button class="quantity-btn" @click="increaseQuantity(item)">
              +
            </button>
          </div>

          <div class="item-total">
            {{ item.product.price * item.quantity }} ₽
          </div>

          <button class="remove-item" @click="removeItem(item.product.id)">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h3 class="summary-title">Итого</h3>
        <div class="summary-row">
          <span>Товары ({{ cartStore.totalItems }})</span>
          <span>{{ cartStore.totalPrice }} ₽</span>
        </div>
        <div class="summary-row">
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
        <div class="summary-total">
          <span>Общая сумма</span>
          <span>{{ cartStore.totalPrice }} ₽</span>
        </div>
        <button class="checkout-btn">Оформить заказ</button>
        <NuxtLink to="/" class="continue-shopping">Продолжить покупки</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 32px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.continue-shopping {
  color: #6a1b9a;
  text-decoration: none;
  font-weight: 500;
}

.continue-shopping:hover {
  text-decoration: underline;
}

.cart-container {
  display: flex;
  gap: 32px;
}

.cart-items {
  flex: 2;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
}

.item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.item-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.item-price {
  font-weight: 600;
  color: #6a1b9a;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

.remove-item {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  margin-left: 16px;
}

.remove-item:hover {
  color: #ff3333;
}

.cart-summary {
  flex: 1;
  background: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 1.3rem;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-weight: 600;
  font-size: 1.1rem;
}

.checkout-btn {
  background: #6a1b9a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  margin-bottom: 16px;
}

.checkout-btn:hover {
  background: #5a148a;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .cart-item {
    flex-wrap: wrap;
  }

  .item-details {
    flex: 100%;
  }

  .item-quantity {
    margin-left: auto;
  }
}
</style>
