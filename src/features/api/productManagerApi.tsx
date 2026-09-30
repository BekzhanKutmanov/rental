import httpClient from "../../shared/api/httpClient";
import type { ProductType } from "../../types/types";

export default async function productPost (product: ProductType){
    const data = await httpClient.post('https://69ce1d6b33a09f831b7cec43.mockapi.io/products', product);

    console.log(data);
    return data;
}