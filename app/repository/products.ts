export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  price: number;
  short_description: string;
  full_description: string;
  category: string;
}

export function createProductRepository(appFetch: typeof $fetch) {
  return {
    all() {
      return appFetch<Product[]>("/products", {
        method: "GET",
      });
    },
    byCategory(category: string) {
      return appFetch<Product[] | null>(`/products?category=${category}`, {
        method: "GET",
      });
    },
  };
}
