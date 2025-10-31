import { Product } from '../types';

/**
 * ব্যাকএন্ড সার্ভার (http://localhost:5000) থেকে সমস্ত প্রোডাক্ট fetch করে আনে।
 */
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

/**
 * একটি নির্দিষ্ট আইডি দিয়ে ব্যাকএন্ড থেকে একটি প্রোডাক্ট fetch করে।
 * (এটি আপনার ProductDetailPage.tsx এর জন্য দরকার হবে)
 */
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
