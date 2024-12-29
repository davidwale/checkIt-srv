export class Order {
    id: number;
    description: string;
    specifications: string;
    quantity: number;
    metadata: object;
    status: string;
    createdAt: Date;
}

export class ChatRoom {
    orderId: number;

}