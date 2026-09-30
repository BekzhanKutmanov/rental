import type { SetBox } from "./SetBoxType"

export interface ProductType {
    id?: number
    title: string
    desc?: string
    set: SetBox | null
    image: string | null
    price: string
}