
import { makeObservable, observable, action, reaction, runInAction, computed } from "mobx";
import BaseStore from "./BaseStore";
import { ProductItem, CatalogueItem, WorkItem, isProductItem, isCatalogueItem/* isWorkItem */ } from '@/types/types';
import { nanoid } from 'nanoid';




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
  catalogueproducts: CatalogueItem[];
  // work: WorkItem[];
  [key: string]: ProductItem[] | Record<string, ProductItem[]> | undefined;
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

      const categoriesWithUid = categories.map((item: ProductItem) => ({
        ...item,
        uid: nanoid(),
      }));

      runInAction(() => {
        // this.products = categoriesWithUid;
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

    console.log("getProducts вызван с keyRaw:", keyRaw);
    console.log("Доступные ключи в dbData:", Object.keys(this.dbData));

    if (!(keyRaw in this.dbData) && keyRaw !== "all") {
      console.warn(`Ключ ${keyRaw} отсутствует в dbData`);
      this.setProducts([]);
      return;
    }

    if (keyRaw === "all") {
      const keysToMerge: DbJsonKey[] = [
        "Products",
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
        if (!(k in this.dbData)) {
          console.warn(`Категория ${k} отсутствует в dbData, пропускаем`);
          continue;
        }

        if (String(k).toLowerCase() === "products" && this.dbData.products) {
          console.log(`Обрабатываем категорию "products" как объект с вложенными массивами`);
          const productsObj = this.dbData.products;
          const flatProducts = Object.values(productsObj).flat();
          console.log(`Найдено ${flatProducts.length} товаров в products`);

          const filtered = flatProducts.filter(isProductItem);
          console.log(`После фильтрации isProductItem осталось ${filtered.length} товаров`);

          data = data.concat(
            filtered.map(item => ({
              ...item,
              uid: nanoid(),
              quantity: item.quantity ?? 1,
            }))
          );
        } else {
          const arr = this.dbData[k];
          if (Array.isArray(arr)) {
            console.log(`Обрабатываем категорию ${k} как массив с ${arr.length} элементами`);
            const filtered = arr.filter(isProductItem);
            console.log(`После фильтрации isProductItem осталось ${filtered.length} товаров`);

            data = data.concat(
              filtered.map(item => ({
                ...item,
                uid: nanoid(),
                quantity: item.quantity ?? 1,
              }))
            );
          } else {
            console.warn(`Категория ${k} не является массивом, а имеет тип ${typeof arr}`);
          }
        }
      }


      // Фильтрация дубликатов uid (на всякий случай)
      const seen = new Set<string>();
      const uniqueData = data.filter(item => {
        if (seen.has(item.uid)) {
          console.warn("Дубликат uid пропущен:", item.uid, item.name);
          return false;
        }
        seen.add(item.uid);
        return true;
      });

      console.log(`Всего уникальных товаров после объединения: ${uniqueData.length}`);

      runInAction(() => {
        this.setProducts(uniqueData);
        this.setCatalogueItems([]);
        this.workItems = [];
      });
    } else if (keyRaw in this.dbData) {
      const key = keyRaw as DbJsonKey;
      const arr = this.dbData[key];

      if (Array.isArray(arr)) {
        console.log(`Обрабатываем категорию ${key} как массив с ${arr.length} элементами`);
        const filtered = arr.filter(isProductItem);
        console.log(`После фильтрации isProductItem осталось ${filtered.length} товаров`);

        const products = filtered.map(item => ({
          ...item,
          uid: nanoid(),
          quantity: item.quantity ?? 1,
        }));

        console.log(`Готово к установке ${products.length} товаров в стор`);

        runInAction(() => {
          this.setProducts(products);
          this.setCatalogueItems([]);
          this.workItems = [];
        });
      } else if (typeof arr === "object" && arr !== null) {
        console.log(`Обрабатываем категорию ${key} как объект с вложенными массивами`);
        const flatProducts = Object.values(arr).flat();
        console.log(`Найдено ${flatProducts.length} товаров в объекте категории`);

        const filtered = flatProducts.filter(isProductItem);
        console.log(`После фильтрации isProductItem осталось ${filtered.length} товаров`);

        const products = filtered.map(item => ({
          ...item,
          uid: nanoid(),
          quantity: item.quantity ?? 1,
        }));

        console.log(`Готово к установке ${products.length} товаров в стор`);

        runInAction(() => {
          this.setProducts(products);
          this.setCatalogueItems([]);
          this.workItems = [];
        });
      } else {
        console.warn(`Категория ${key} имеет неожиданный тип: ${typeof arr}`);
        this.setProducts([]);
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
      console.log("dbData не загружен, загружаем...");
      await this.loadDbJson();
      console.log("dbData загружен");
    }

    let products: unknown[] = [];

    if (!categoryKey || categoryKey === "all") {
      // Главная страница — категории
      products = this.dbData.catalogueproducts ?? [];
    } else {
      // Товары категории
      products = this.dbData[categoryKey] ?? [];
    }

    // Пример фильтрации или проверки типа элементов
    if (products.length > 0) {
      if (isCatalogueItem(products[0])) {
        console.log("Загружены категории (CatalogueItem)");
        // Можно тут делать дополнительные действия для категорий
      } else if (isProductItem(products[0])) {
        console.log("Загружены товары (ProductItem)");
        // Логика для товаров
      } else {
        console.warn("Неизвестный тип элементов в products");
      }
    }

    this.setProducts(products);
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
