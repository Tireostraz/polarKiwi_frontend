export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  price: number;
  shortDescription: string;
  fullDescription: string;
  category: string;
}

export function createProductRepository() {}
