// types.ts
export interface ProductItem {
  uid?:string;
  id: string  ;
  name: string;
  category: string;
  color: string | string[];
  price: string ;
  imgSrc: string;
  quantity?: number;
}
export interface CatalogueItem {
  uid: string;
  id: string;
  slug:string
  name: string;
  imgSrc: string;
}
export interface WorkItem {
  uid?:string
  id: string;
  title: string;
  description?: string;
  
}
export function isProductItem(item: unknown): item is Omit<ProductItem, "uid" | "quantity"> & Partial<Pick<ProductItem, "quantity">> {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.category === "string" &&
    (typeof obj.color === "string" || Array.isArray(obj.color)) &&
    typeof obj.price === "string" &&
    typeof obj.imgSrc === "string"
  );
}



export function isCatalogueItem(item: unknown): item is CatalogueItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.uid === "string" &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.imgSrc === "string"
  );
}
export function isWorkItem(item: unknown): item is WorkItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;

  if (typeof obj.id !== "string") return false;
  if (typeof obj.title !== "string") return false;

  if ("description" in obj && obj.description !== undefined && typeof obj.description !== "string") return false;
  if ("uid" in obj && obj.uid !== undefined && typeof obj.uid !== "string") return false;

  return true;
}


