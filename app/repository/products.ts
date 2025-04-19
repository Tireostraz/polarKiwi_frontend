export interface Product {
  id: number;
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
    byId(id: number) {
      return appFetch<Product | null>(`/products/${id}`, {
        method: "GET",
      });
    },
  };
}
