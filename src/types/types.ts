// types.ts
export interface ProductItem {
  uid:string
  id: string ;
  name: string;
  category: string;
  color: string | string[];
  price: string ;
  imgSrc: string;
  quantity: number;
}
