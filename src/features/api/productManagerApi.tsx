import httpClient from "../../shared/api/httpClient";
import type { ProductType } from "../../types/types";

export async function productFetch() {
    const data = await httpClient.get('https://69ce1d6b33a09f831b7cec43.mockapi.io/products');

    console.log(data);
    return data;
}

export async function productPost(product: ProductType) {
    console.log(product);

    const data = await httpClient.post('https://69ce1d6b33a09f831b7cec43.mockapi.io/products', product);

    console.log(data);
    return data;
}