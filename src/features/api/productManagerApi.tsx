import httpClient from "../../shared/api/httpClient";
import type { ProductType } from "../../types/types";

const PRODUCTS_URL = 'https://69ce1d6b33a09f831b7cec43.mockapi.io/products';

export async function productFetch() {
    const data = await httpClient.get<ProductType[]>(PRODUCTS_URL);
    return data;
}

export async function productPost(product: ProductType) {
    console.log(product);

    const data = await httpClient.post<ProductType>(PRODUCTS_URL, product);
    return data;
}

export async function productFetchById(id: number) {    
    const data = await httpClient.get<ProductType>(`${PRODUCTS_URL}/${id}`);
    return data;
}

export async function productPut(id: number, product: ProductType) {
    const data = await httpClient.put<ProductType>(`${PRODUCTS_URL}/${id}`, product);
    return data;
}

export async function productDelete(id: number) {
    const data = await httpClient.delete<ProductType>(`${PRODUCTS_URL}/${id}`);
    return data;
}
