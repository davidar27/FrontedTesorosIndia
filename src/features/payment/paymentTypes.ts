export interface PaymentItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface CreatePreferencePayload {
    items: PaymentItem[];
    total: number;
}