
import { makeObservable, observable, action, reaction, runInAction, computed } from "mobx";
import BaseStore from "./BaseStore";
import { ProductItem } from '@/types/types';
import { nanoid } from 'nanoid';


interface WorkItem {
  id: string;
  title: string;
  description?: string;
  // другие поля по необходимости
}

type DbJson = {
  kitchen: ProductItem[];
  drawingroom: ProductItem[];
  nursery: ProductItem[];
  couch: ProductItem[];
  bedroom: ProductItem[];
  hallway: ProductItem[];
  cupboard: ProductItem[];
  tables_and_chairs: ProductItem[];
  products: ProductItem[];
  catalogueproducts: ProductItem[];
  work: WorkItem[];
};

class CatalogueStore extends BaseStore {
  products: ProductItem[] = [];
  workItems: WorkItem[] = [];
  basket: ProductItem[] = [];
  selectedCategory: string = "all";
  dbData: DbJson | null = null;

  constructor() {
    super();

    makeObservable(this, {
      products: observable,
      workItems: observable,
      basket: observable,
      selectedCategory: observable,
      totalQuantity: computed,
      quantity: computed,
      getCategories:action.bound,
      getProducts: action.bound,
      getWorkItems: action.bound,
      addProductToBasket: action.bound,
      addProductToBasketById: action.bound,
      incrementProductQuantity: action.bound,
      decrementProductQuantity: action.bound,
      deleteProductFromBasket: action.bound,
      clearProduct: action.bound,
      initializeBasket: action.bound,
      loadInitialData: action.bound,
      loadDbJson: action.bound,
      setSelectedCategory: action.bound,
    });

    reaction(
      () => this.basket.map(item => ({ id: item.id, quantity: item.quantity })),
      basketItems => {
        if (typeof window !== "undefined") {
          localStorage.setItem("basket", JSON.stringify(basketItems));
        }
      }
    );
  }

  async setSelectedCategory(categoryKey: string) {
    this.selectedCategory = categoryKey;
    await this.getProducts(categoryKey);
  }

  get totalQuantity() {
    return this.basket.reduce((total, item) => total + (item.quantity ?? 0), 0);
  }

  get quantity() {
    return this.totalQuantity;
  }
async getCategories(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/db.json`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const json = await response.json();

      const categories = Array.isArray(json.catalogueproducts) ? json.catalogueproducts : [];

      const categoriesWithUid = categories.map((item: ProductItem) => ({
        ...item,
        uid: nanoid(),
      }));

      runInAction(() => {
        this.products = categoriesWithUid;
      });
    } catch (error) {
      console.error("Ошибка при загрузке категорий", error);
    }
  }
  async getProducts(categoryKey: string): Promise<void> {
    if (!categoryKey || typeof categoryKey !== 'string') {
      console.warn('getProducts вызван с некорректным ключом категории:', categoryKey);
      return;
    }
    try {
      const response = await fetch(`${this.baseUrl}/db.json`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const json = await response.json();

      const key = categoryKey.replace(/^\//, '').toLowerCase();

      let data: ProductItem[];

      if (key === 'all') {
        data = [];
        const keysToMerge = ['catalogueproducts', 'products', 'kitchen', 'drawingroom', 'bedroom'];
        for (const k of keysToMerge) {
          if (Array.isArray(json[k])) {
            data = data.concat(json[k]);
          }
        }
      } else if (key === 'catalogueproducts') {
  // только массив catalogueproducts
  data = Array.isArray(json.catalogueproducts) ? json.catalogueproducts : [];
}else {
        if (!(key in json)) {
          throw new Error(`Категория ${categoryKey} не найдена в данных`);
        }
        data = json[key];
        if (!Array.isArray(data)) throw new Error(`Данные для категории ${categoryKey} не являются массивом`);
        console.log("Загружаем категорию:", key, "Данные:", data);
      }
      // Добавляем уникальный uid к каждому продукту
    const dataWithUid = data.map(item => ({
      ...item,
      uid: nanoid(),
    }));

    runInAction(() => {
      this.products = dataWithUid;
    });
  } catch (error) {
    console.error('Ошибка при загрузке продуктов', error);
    throw error;
  }

    //   runInAction(() => {
    //     this.products = data;
    //   });
    // } catch (error) {
    //   console.error('Ошибка при загрузке продуктов', error);
    //   throw error;
    // }
  }

  async getWorkItems(url: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data: WorkItem[] = await response.json();
      runInAction(() => {
        this.workItems = data;
      });
    } catch (error) {
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

  addProductToBasketById(productId: string): void {
    const product = this.products.find(p => String(p.id) === String(productId));
    if (product) {
      this.addProductToBasket(product);
    } else {
      console.warn(`Product with id ${productId} not found in catalogue`);
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

  clearProduct(id: string): void {
    this.basket = this.basket.filter(item => String(item.id) !== String(id));
  }

  initializeBasket(): void {
    if (typeof window === 'undefined') return;

    const savedBasketJson = localStorage.getItem("basket");
    if (savedBasketJson) {
      try {
        const savedBasket: { id: string; quantity: number }[] = JSON.parse(savedBasketJson);
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

 async loadInitialData(categoryKey?: string): Promise<void> {
  if (categoryKey) {
    await this.getProducts(categoryKey);  // сначала загрузка продуктов
  }
  this.initializeBasket();                // потом инициализация корзины
}

  async loadDbJson(): Promise<void> {
    if (typeof window !== "undefined")
    try {
      const response = await fetch(`${this.baseUrl}/db.json`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const json: DbJson = await response.json();
      runInAction(() => {
        this.dbData = json;
      });
    } catch (error) {
      console.error("Ошибка загрузки db.json", error);
    }
  }
}

const catalogueStore = new CatalogueStore();
export default catalogueStore;
