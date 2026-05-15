export interface BillDTO {
    id: number;
    invoiceNumber: string;
    client: {
        id: number;
        name: string;
        email: string;
    };
    amount: number;
    date: string;
    status: string;
    createdAt: string;
}
