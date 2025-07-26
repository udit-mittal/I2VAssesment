export interface Sale {
  saleID: number;
  totalAmount: number;
  saleDate: string;
  salesItems: SalesItem[];
}

export interface SalesItem {
  salesItemID: number;
  saleID: number;
  productID: number;
  quantity: number;
} 