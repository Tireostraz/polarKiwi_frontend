import type { Product } from "~/repository/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as Array<{ product: Product; quantity: number }>,
  }),
  actions: {
    addToCart(product: Product) {
      const existingItem = this.items.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ product, quantity: 1 });
      }
      // Можно добавить уведомление или toast
    },
    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId);
    },
    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart() {
      this.items = [];
    },
  },
  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
  },
});
