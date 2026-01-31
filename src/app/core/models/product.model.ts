export interface ProductModel {
  id: number;
  title: string;
  category: string;
  description: string;
  images: string[];
  price: string;
}

export interface ProductList {
  page: number;
  products: ProductModel[];
  per_page: number;
  total: number;
  total_pages: number;
}
