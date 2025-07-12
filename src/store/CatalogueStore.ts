
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
  products?: Record<string, ProductItem[]>;
  catalogueproducts: ProductItem[];
  work: WorkItem[];
};

class CatalogueStore extends BaseStore {
  // Храним текущий список продуктов для выбранной категории
  products: ProductItem[] = [];
  workItems: WorkItem[] = [];
  basket: ProductItem[] = [];
  // Выбранная категория (например, 'kitchen', 'all' и т.п.)
  selectedCategory: string = "all";
  // Храним все данные из db.json после загрузки
  dbData: DbJson | null = null;
  
// Флаг загрузки db.json
  private isLoadingDbData = false;

  constructor() {
    super();

    makeObservable(this, {
      products: observable,
      workItems: observable,
      basket: observable,
      selectedCategory: observable,
      totalQuantity: computed,
      quantity: computed,
      getCategories: action.bound,
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
      setProducts: action,
      setDbData: action,
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
  /**
     * Устанавливает текущую категорию и загружает продукты для неё
     * @param categoryKey - ключ категории, например 'kitchen' или 'all'
     */
  async setSelectedCategory(categoryKey: string) {
    this.selectedCategory = categoryKey;
    // Загружаем продукты для выбранной категории
    await this.getProducts(categoryKey);
  }
  /**
    * Устанавливает список продуктов в observable поле
    * @param products - массив продуктов
    */
  setProducts(products: ProductItem[]) {
    this.products = products;
  }
  /**
  * Устанавливает загруженные данные db.json
  * @param data - объект с данными из db.json
  */
  setDbData(data: DbJson) {
    this.dbData = data;
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
  /**
   * Получает продукты для заданной категории из загруженного dbData.
   * Если dbData ещё не загружен, сначала вызывает loadDbJson.
   * Обновляет observable products.
   * @param categoryKey - категория, например 'kitchen'
   */
 
  async getProducts(categoryKey: string): Promise<void> {
    runInAction(() => {
    this.setProducts([]);
  });
  if (!this.dbData) {
    await this.loadDbJson();
    if (!this.dbData) {
      console.warn("getProducts: dbData не загружен, прерываем");
        return;
    }
  }

  const keyRaw = categoryKey.replace(/^\//, "").toLowerCase();

  // Ключи DbJson
  type DbJsonKey = keyof DbJson;

  if (keyRaw === "all") {
    // Объединяем все категории с ProductItem[], кроме work
    const keysToMerge: DbJsonKey[] = [
      "catalogueproducts",
      "products",
      "kitchen",
      "drawingroom",
      "nursery",
      "couch",
      "bedroom",
      "hallway",
      "cupboard",
      "tables_and_chairs",
    ];

    let data: ProductItem[] = [];

    for (const k of keysToMerge) {
      if (!(k in this.dbData)) continue;

      if (k === "products" && this.dbData.products) {
        // products — объект с динамическими ключами
        const productsObj = this.dbData.products;
        data = data.concat(Object.values(productsObj).flat());
      } else {
        const arr = this.dbData[k];
        if (Array.isArray(arr)) {
          data = data.concat(arr as ProductItem[]);
        }
      }
    }

    runInAction(() => {
      this.setProducts(data.map(item => ({ ...item, uid: nanoid() })));
    });

  } else if (keyRaw in this.dbData) {
    const key = keyRaw as DbJsonKey;

    if (key === "products" && this.dbData.products) {
      // Если категория "products", можно вернуть все вложенные массивы
      const data = Object.values(this.dbData.products).flat();
      runInAction(() => {
        this.setProducts(data.map(item => ({ ...item, uid: nanoid() })));
      });
    } else if (key === "work") {
      // work — другой тип, обработайте отдельно, если нужно
      console.warn("Категория work содержит WorkItem[], не ProductItem[]");
      runInAction(() => {
        this.setProducts([]); // или обработать по-другому
      });
    } else {
      const arr = this.dbData[key];
      if (Array.isArray(arr)) {
        runInAction(() => {
          this.setProducts(arr.map(item => ({ ...item, uid: nanoid() })));
        });
      } else {
        runInAction(() => {
          this.setProducts([]);
        });
      }
    }

  } else {
    console.warn(`Категория ${keyRaw} не найдена в db.json`);
    runInAction(() => this.setProducts([]));
  }
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
async loadCategories() {
  if (!this.dbData) {
    await this.loadDbJson();
  }
  if (!this.dbData) return;

  const categories = Array.isArray(this.dbData.catalogueproducts) ? this.dbData.catalogueproducts : [];
  runInAction(() => {
    this.products = categories.map(item => ({ ...item, uid: nanoid() }));
  });
}
  // async loadInitialData(categoryKey?: string): Promise<void> {
  //   if (categoryKey) {
  //     await this.getProducts(categoryKey);  // сначала загрузка продуктов
  //   }
  //   this.initializeBasket();                // потом инициализация корзины
  // }
async loadInitialData(categoryKey?: string): Promise<void> {
  if (!categoryKey || categoryKey === "all") {
    await this.loadCategories();
  } else {
    await this.getProducts(categoryKey);
  }
  this.initializeBasket();
}
  async loadDbJson(): Promise<void> {
    if (this.dbData) {
      console.log("loadDbJson: dbData уже загружен, повторная загрузка не нужна");
      return;
    }
    if (this.isLoadingDbData) {
      console.log("loadDbJson: загрузка уже выполняется, ждём завершения");
      // Можно реализовать ожидание завершения, если нужно
      return;
    }

    this.isLoadingDbData = true;
    console.log("loadDbJson: начинаем загрузку db.json");

    try {
      const response = await fetch(`${this.baseUrl}/db.json`);
      if (!response.ok) throw new Error(`Ошибка загрузки db.json: ${response.status}`);

      const json: DbJson = await response.json();
      runInAction(() => {
        this.dbData = json;
        console.log("loadDbJson: dbData успешно установлен");
      });
    } catch (error) {
      console.error("Ошибка загрузки db.json", error);
    } finally {
      runInAction(() => {
        this.isLoadingDbData = false;
      });
    }
  }

}

const catalogueStore = new CatalogueStore();
export default catalogueStore;
