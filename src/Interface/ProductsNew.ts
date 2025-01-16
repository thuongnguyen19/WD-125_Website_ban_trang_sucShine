import axiosInstance from "../configs/axios";
export interface ProductsNew{
  id: number;
  name: string;
  thumbnail: string;
  variants: Array<{
    id_product: number;
    selling_price: number;
    list_price: number;
  }>;
}

export const fetchProductsNew = async (): Promise<ProductsNew[]> => {
  const response = await axiosInstance.get<ProductsNew[]>("/products/new");
  return response.data;
};

export interface Combo {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;
}

export const fetchCombos = async (): Promise<Combo[]> => {
  const response = await axiosInstance.get<Combo[]>("/combo");
  return response.data;
};