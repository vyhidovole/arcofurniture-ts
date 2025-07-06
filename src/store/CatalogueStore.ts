
import { makeObservable, observable, action, reaction, runInAction, computed } from "mobx";
import BaseStore from "./BaseStore"
import { ProductItem } from '@/types/types';

interface WorkItem {
  id: string;
  title: string;
  description?: string;
  // другие поля по необходимости
}

class CatalogueStore extends BaseStore {
  products: ProductItem[] = [];
  workItems: WorkItem[] = [];
  basket: ProductItem[] = [];

  constructor() {
    super();
    makeObservable(this, {
      products: observable,
      workItems: observable,
      basket: observable,
      quantity: computed,
      totalQuantity: computed,
      getProducts: action,
      addProductToBasket: action,
      deleteProductFromBasket: action,
      initializeBasket: action,
      incrementProductQuantity: action,
      decrementProductQuantity: action,
      clearProduct: action,
      getWorkItems: action,
      addProductToBasketById: action,
    });

    // Сохраняем корзину в localStorage при любых изменениях (включая quantity)
   reaction(
  () => this.basket.map(item => ({ id: item.id, quantity: item.quantity })),
  basketItems => {
    if (typeof window !== "undefined") {
      localStorage.setItem("basket", JSON.stringify(basketItems));
    }
  }
);
  }

  // Геттер для подсчёта общего количества товаров
  get totalQuantity() {
    return this.basket.reduce((total, item) => total + (item.quantity ?? 0), 0);
  }

  get quantity() {
    return this.totalQuantity;
  }

  async getProducts(categoryKey: string): Promise<void> {
    try {
      const response = await fetch('/db.json');
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const json = await response.json();
      const key = categoryKey.startsWith('/') ? categoryKey.slice(1).toLowerCase() : categoryKey.toLowerCase();

      const data: ProductItem[] = json[key];
      if (!Array.isArray(data)) throw new Error(`Данные для категории ${categoryKey} не найдены`);

      runInAction(() => {
        this.products = data;
      });
    } catch (error) {
      console.error('Ошибка при загрузке продуктов', error);
      throw error;
    }
  }

  async getWorkItems(url: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if(!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data: WorkItem[] = await response.json();
      runInAction(() => {
        this.workItems = data;
      });
    } catch(error) {
      console.error("Ошибка при загрузке работ:", error);
    }
  }

  addProductToBasket(product: ProductItem): void {
    const existingProduct = this.basket.find(item => String(item.id) === String(product.id));
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity ?? 0) + 1;
    } else {
      this.basket.push({ ...product, quantity: 1 });
    }
  }

  incrementProductQuantity(productId: string): void {
    const product = this.basket.find(item => String(item.id) === String(productId));
    if (product) {
      product.quantity = (product.quantity ?? 0) + 1;
    }
  }

  decrementProductQuantity(productId: string): void {
    const product = this.basket.find(item => String(item.id) === String(productId));
    if (product && product.quantity !== undefined) {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.deleteProductFromBasket(productId);
      }
    }
  }

  deleteProductFromBasket(itemId: string): void {
    this.basket = this.basket.filter(item => String(item.id) !== String(itemId));
  }

  clearProduct(id: string) {
    this.basket = this.basket.filter(item => String(item.id) !== String(id));
  }

  addProductToBasketById(productId: string): void {
    const product = this.products.find(p => String(p.id) === String(productId));
    if (product) {
      this.addProductToBasket(product);
    } else {
      console.warn(`Product with id ${productId} not found in catalogue`);
    }
  }

 // Инициализация корзины (вызывать после загрузки products)
initializeBasket(): void {
  if (typeof window === 'undefined') return;

  const savedBasketJson = localStorage.getItem("basket");
  if (savedBasketJson) {
    try {
      const savedBasket: {id: string; quantity: number}[] = JSON.parse(savedBasketJson);
      runInAction(() => {
        this.basket = savedBasket.map(({ id, quantity }) => {
          const product = this.products.find(p => String(p.id) === String(id));
          if (!product) {
            console.warn(`Product with id ${id} not found in catalogue during basket initialization`);
            return null;
          }
          return { ...product, quantity };
        }).filter(Boolean) as ProductItem[];
      });
    } catch (error) {
      console.error("Ошибка при парсинге корзины из localStorage:", error);
    }
  }
}
//  метод для загрузки продуктов и инициализации корзины вместе
async loadInitialData(categoryKey?: string) {
  if (categoryKey) {
    await this.getProducts(categoryKey);
  }
  this.initializeBasket();
}
}

const catalogueStore = new CatalogueStore();
catalogueStore.initializeBasket();
export default catalogueStore;
