import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("http://localhost:5000/api/products");

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Product[];
  
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
};


export const fetchProductById = async (id: string): Promise<Product | null> => {
   try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product (id: ${id}): ${response.statusText}`);
    }

    const data = await response.json();
    return data as Product;
  
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
