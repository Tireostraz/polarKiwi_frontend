export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  pages_quantity: number;
  category: string;
  short_description: string;
  full_description: string;
  thumbnail: string;
  is_active: boolean;
  images: string[];
  images_details: {
    url: string;
    alt_text: string;
  };
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
    byIds(ids: Array<number>) {
      return appFetch<Product[]>("/products/batch", {
        method: "POST",
        body: { product_ids: ids },
      });
    },
  };
}
