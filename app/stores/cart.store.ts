import type { Product } from "~/repository/products";
import { defineStore } from "pinia";

export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<Array<{ product: Product; quantity: number }>>([]);

    const totalItems = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalPrice = computed(() =>
      items.value.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    );

    function addToCart(product: Product) {
      const { $toast } = useNuxtApp();
      const existingItem = items.value.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        $toast.base.success(`Товар "${product.title}" обновлен в корзине`);
      } else {
        items.value.push({ product, quantity: 1 });
        $toast.cartAdded(product.title);
      }
    }

    function removeFromCart(productId: number) {
      const { $toast } = useNuxtApp();
      const item = items.value.find((item) => item.product.id === productId);
      if (item) {
        items.value = items.value.filter(
          (item) => item.product.id !== productId
        );
        $toast.cartRemoved(item.product.title);
      }
    }

    function updateQuantity(productId: number, quantity: number) {
      const item = items.value.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }

    function clearCart() {
      const { $toast } = useNuxtApp();
      if (items.value.length > 0) {
        $toast.base.info("Корзина очищена");
        items.value = [];
      }
    }

    return {
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  },
  {
    persist: true,
  }
);
