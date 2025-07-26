
import { makeObservable, observable, action, reaction, runInAction, computed } from "mobx";
import BaseStore from "./BaseStore";
import { ProductItem, CatalogueItem, WorkItem, isProductItem /* isWorkItem */ } from '@/types/types';
import { nanoid } from 'nanoid';


function addUidToCatalogueItem(item: CatalogueItem): CatalogueItem & { uid: string } {
  return {
    ...item,
    uid: nanoid(),
  };
}

function addUidToProductItem(
  item: Omit<ProductItem, "uid" | "quantity"> & Partial<Pick<ProductItem, "quantity">>
): ProductItem {
  return {
    ...item,
    uid: nanoid(),
    quantity: item.quantity ?? 1,
  };
}

function isProductItemArray(arr: unknown[]): arr is ProductItem[] {
  return arr.every(isProductItem);
}

type DbJson = {
  catalogueproducts: CatalogueItem[];  // категории
  kitchen: ProductItem[];
  drawingroom: ProductItem[];
  nursery: ProductItem[];
  couch: ProductItem[];
  bedroom: ProductItem[];
  hallway: ProductItem[];
  cupboard: ProductItem[];
  tables_and_chairs: ProductItem[];
  products?: Record<string, ProductItem[]>;
  // work?: WorkItem[];
  [key: string]: ProductItem[] | Record<string, ProductItem[]> | CatalogueItem[] | undefined;
};
type DbJsonKey = keyof DbJson;
class CatalogueStore extends BaseStore {
  // Храним текущий список продуктов для выбранной категории
  products: ProductItem[] = [];
  workItems: WorkItem[] = [];
  basket: ProductItem[] = [];
  catalogueproducts: CatalogueItem[] = [];

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
      catalogueproducts: observable,
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
      setCatalogueItems: action.bound,
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
  setProducts(items: ProductItem[]) {
    console.log("setProducts: получено продуктов", items.length);
    console.log("UIDs:", items.map(i => i.uid));
    this.products = items;
  }

  setCatalogueItems(items: CatalogueItem[]) {
    this.catalogueproducts = items;
  }

  /**
  * Устанавливает загруженные данные db.json
  * @param data - объект с данными из db.json
  */
  setDbData(data: DbJson) {
    this.dbData = data;
    console.log("dbData загружен:", Object.keys(data));
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

      const categoriesWithUid = categories.map((item: CatalogueItem) => ({
        ...item,
        uid: nanoid(),
      }));

      runInAction(() => {
        this.catalogueproducts = categoriesWithUid;
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

  getProducts(keyRaw: string) {
    if (!this.dbData) {
      console.warn("dbData отсутствует");
      return;
    }

    if (!(keyRaw in this.dbData) && keyRaw !== "all") {
      console.warn(`Ключ ${keyRaw} отсутствует в dbData`);
      runInAction(() => {
        this.products = [];
        this.catalogueproducts = [];
        this.workItems = [];
      });
      return;
    }

    if (keyRaw === "all") {
      // Загружаем категории
      const categories = this.dbData.catalogueproducts;
      if (Array.isArray(categories)) {
        const categoriesWithUid = categories.map(addUidToCatalogueItem);
        runInAction(() => {
          this.catalogueproducts = categoriesWithUid;
          this.products = [];
          this.workItems = [];
        });
      } else {
        console.warn("catalogueproducts отсутствует или не массив");
        runInAction(() => {
          this.catalogueproducts = [];
          this.products = [];
          this.workItems = [];
        });
      }
    } else {
      // Загружаем продукты
      const data = this.dbData[keyRaw as DbJsonKey];

      if (Array.isArray(data) && isProductItemArray(data)) {
        const products = (data as ProductItem[]).map(addUidToProductItem);
        runInAction(() => {
          this.products = products;
          this.catalogueproducts = [];
          this.workItems = [];
        });
      } else if (typeof data === "object" && data !== null) {
        // обработка вложенных массивов
        const flatProducts = Object.values(data).flat();
        const filtered = flatProducts.filter(isProductItem);
        const products = filtered.map(addUidToProductItem);
        runInAction(() => {
          this.products = products;
          this.catalogueproducts = [];
          this.workItems = [];
        });
      } else if (typeof data === "object" && data !== null) {
        // Объект с вложенными массивами продуктов
        const flatProducts = Object.values(data).flat();
        const filtered = flatProducts.filter(isProductItem);
        const products = filtered.map(addUidToProductItem);

        runInAction(() => {
          this.products = products;
          this.catalogueproducts = [];
          this.workItems = [];
        });
      } else {
        console.warn(`Категория ${keyRaw} имеет неожиданный тип`);
        runInAction(() => {
          this.products = [];
          this.catalogueproducts = [];
          this.workItems = [];
        });
      }
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
      this.catalogueproducts = categories.map(item => ({ ...item, uid: nanoid() }));
    });
  }

  async loadInitialData(categoryKey?: string): Promise<void> {
    if (!this.dbData) {
      await this.loadDbJson();
    }
    if (!this.dbData) return;

    if (!categoryKey || categoryKey === "all") {
      // Загружаем категории
      const categories = this.dbData.catalogueproducts ?? [];
      const categoriesWithUid = categories.map(addUidToCatalogueItem);

      runInAction(() => {
        this.setCatalogueItems(categoriesWithUid);
        this.setProducts([]); // очищаем продукты
        this.workItems = [];
      });
    } else {
      // Загружаем продукты
      const data = this.dbData[categoryKey];

      if (Array.isArray(data)) {
        // Проверяем, что элементы — продукты
        const filtered = data.filter(isProductItem) as ProductItem[];
        const products = filtered.map(addUidToProductItem);

        runInAction(() => {
          this.setProducts(products);
          this.setCatalogueItems([]);
          this.workItems = [];
        });
      } else if (typeof data === "object" && data !== null) {
        // Обрабатываем вложенный объект с массивами продуктов
        const flatProducts = Object.values(data).flat();
        const filtered = flatProducts.filter(isProductItem);
        const products = filtered.map(addUidToProductItem);

        runInAction(() => {
          this.setProducts(products);
          this.setCatalogueItems([]);
          this.workItems = [];
        });
      } else {
        // Нет данных или неизвестный формат
        runInAction(() => {
          this.setProducts([]);
          this.setCatalogueItems([]);
          this.workItems = [];
        });
      }
    }

    this.initializeBasket();
  }


  async loadDbJson() {
    try {
      const response = await fetch("/db.json");
      const data = await response.json();
      console.log("db.json загружен:", data);
      runInAction(() => {
        this.dbData = data;
      });
    } catch (error) {
      console.error("Ошибка загрузки db.json", error);
    }
  }

}

const catalogueStore = new CatalogueStore();
export default catalogueStore;
