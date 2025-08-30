
import { makeObservable, observable, action, runInAction, computed, reaction } from "mobx";
import BaseStore from "./BaseStore";
import { ProductItem, CatalogueItem, WorkItem } from '@/types/types';
import { nanoid } from 'nanoid';
import { normalizeCategory } from '@/utils/utils'

function addUidToCatalogueItem(item: CatalogueItem): CatalogueItem & { uid: string } {
  return {
    ...item,
    uid: nanoid(),
  };
}

// function addUidToProductItem(
//   item: Omit<ProductItem, "uid"> & Partial<Pick<ProductItem, "quantity">>
// ): ProductItem {
//   return {
//     ...item,
//     uid: nanoid(),
//   };
// }

class CatalogueStore extends BaseStore {
  catalogueproducts: CatalogueItem[] = [];
  products: ProductItem[] = [];
  basket: ProductItem[] = [];
  workItems: WorkItem[] = []; // Инициализируем массив работ

  error: string | null = null;

  selectedCategory: string = "all";

  constructor() {
    super();

    makeObservable(this, {
      catalogueproducts: observable,
      products: observable,
       workItems: observable,
      basket: observable,
      selectedCategory: observable,
      error: observable,
      totalQuantity: computed,
      loadCategories: action.bound,
      loadInitialData: action.bound,
      loadProductsByCategory: action.bound,
      addProductToBasket: action.bound,
      incrementProductQuantity: action.bound,
      decrementProductQuantity: action.bound,
      deleteProductFromBasket: action.bound,
      clearProduct: action.bound,
      initializeBasket: action.bound,
      setSelectedCategory: action.bound,
       getWorkItems:action.bound,
    });

    // Автоматическое сохранение корзины в localStorage при изменениях
    reaction(
      () => this.basket.map(item => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        category: item.category,
        color: item.color,
        price: item.price,
        imgSrc: item.imgSrc
      })),
      basketItems => {
        console.log("Сохраняем в localStorage:", basketItems); // Логируем перед сохранением
        if (typeof window !== "undefined") {
          localStorage.setItem("basket", JSON.stringify(basketItems));
        }
      }
    );


    this.initializeBasket();
  }

  get totalQuantity() {
    return this.basket.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }

  // Загрузка категорий с сервера (например, с /db.json или API)
  async loadCategories() {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await fetch("/db.json");
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      const data = await response.json();

      const categoriesRaw = Array.isArray(data.catalogueproducts) ? data.catalogueproducts : [];
      const categories = categoriesRaw.map(addUidToCatalogueItem);

      runInAction(() => {
        this.catalogueproducts = categories;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : String(e);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Загрузка продуктов по категории с сервера (например, с /db.json или API)
  async loadProductsByCategory(categorySlug: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch("/db.json");
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      const data = await response.json();
      console.log("Данные из db.json:", data); // Отладка


      // Нормализуем ключ
      const normalizedKey = normalizeCategory(categorySlug);
      let productsRaw;
      // Проверяем наличие ключа
      if (data[normalizedKey]) {
        productsRaw = data[normalizedKey]; // Если ключ найден в нормализованном виде
      } else if (normalizedKey === 'product') {
        productsRaw = data['Product']; // Если ключ "Product"
      } else {
        console.warn(`Категория '${normalizedKey}' не найдена.`);
        productsRaw = []; // Устанавливаем пустой массив, если категория не найдена
      }
      console.log("Продукты по категории:", productsRaw); // Отладка
      // Проверяем, есть ли продукты по данному slug
      if (!Array.isArray(productsRaw)) {
        console.warn(`Категория '${categorySlug}' не найдена или не содержит продуктов.`);
        runInAction(() => {
          this.products = []; // Устанавливаем пустой массив, если категория не найдена 
        })
        return;
      }

      // Если продукты найдены, сохраняем их в store
      runInAction(() => {
        this.products = productsRaw.map(product => ({
          ...product,
          // Можно добавить дополнительные поля или преобразования, если нужно
        }));
        this.selectedCategory = categorySlug; // Сохраняем выбранную категорию
      });
    } catch (e) {
      console.error("Ошибка при загрузке продуктов:", e);
      runInAction(() => {
        this.error = e instanceof Error ? e.message : String(e);
        this.products = [];
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }


  async loadInitialData(categoryKey: string) {
    await this.loadCategories();
    await this.loadProductsByCategory(categoryKey);

  }

  addProductToBasket(product: ProductItem) {
    runInAction(() => {
      // Ищем товар в корзине по id и category
      const existing = this.basket.find(
        item => item.id === product.id && item.category === product.category
      );

      if (existing) {
        // Если товар уже есть в корзине, увеличиваем его количество
        existing.quantity = (existing.quantity ?? 0) + 1;
      } else {
        // Если товара нет, добавляем его в корзину с количеством 1
        this.basket.push({ ...product, quantity: 1 });
      }
      // this.saveBasketToLocalStorage();
    });
  }


  incrementProductQuantity(productId: string, productCategory: string) {
    runInAction(() => {
      // Ищем товар в корзине по id и category
      const product = this.basket.find(
        item => String(item.id) === String(productId) && item.category === productCategory
      );

      if (product) {
        // Увеличиваем количество товара
        product.quantity = (product.quantity ?? 0) + 1;
      }
      //  this.saveBasketToLocalStorage();
    });
  }

  decrementProductQuantity(productId: string, productCategory: string) {
    runInAction(() => {
      // Ищем товар в корзине по id и category
      const product = this.basket.find(
        item => String(item.id) === String(productId) && item.category === productCategory
      );

      if (product && product.quantity !== undefined) {
        if (product.quantity > 1) {
          product.quantity -= 1; // Уменьшаем количество
        } else {
          this.deleteProductFromBasket(productId, productCategory); // Удаляем товар, если количество 1
        }
      }
      //  this.saveBasketToLocalStorage();
    });
  }

  deleteProductFromBasket(productId: string, productCategory: string) {
    runInAction(() => {
      // Удаляем товар из корзины по id и category
      this.basket = this.basket.filter(
        item => String(item.id) !== String(productId) || item.category !== productCategory
      );
      //  this.saveBasketToLocalStorage();
    });
  }


  clearProduct(productId: string, productCategory: string) {
    this.deleteProductFromBasket(productId, productCategory);
    //  this.saveBasketToLocalStorage();
  }

  initializeBasket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.localStorage) {
        return resolve(); // Если localStorage недоступен, просто завершаем
      }

      const basketJson = localStorage.getItem("basket");
      console.log("Загруженные товары из localStorage:", basketJson); // Логируем загруженные данные
      if (!basketJson) return resolve();

      try {
        const savedItems = JSON.parse(basketJson);
        if (!Array.isArray(savedItems)) throw new Error("Сохраненные данные не являются массивом.");

        // Обновляем корзину, добавляя недостающие параметры из products
        const updatedBasket = savedItems.map(savedItem => {
          const product = this.products.find(p => p.id === savedItem.id && p.category === savedItem.category);
          if (product) {
            return {
              ...product, // добавляем все параметры продукта
              quantity: savedItem.quantity // сохраняем количество
            };
          }
          return savedItem; // Если продукта нет, возвращаем сохраненный элемент
        });

        runInAction(() => {
          this.basket = updatedBasket; // Обновляем состояние корзины
        });
        resolve(); // Успешно завершено
      } catch (e) {
        console.error("Ошибка при загрузке корзины:", e);
        reject(e); // Завершение с ошибкой
      }
    });
  }



  // Метод для сохранения корзины в localStorage
  saveBasketToLocalStorage() {
    const basketToSave = this.basket.map(item => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      category: item.category,
      color: item.color,
      price: item.price,
      imgSrc: item.imgSrc
    }));

    localStorage.setItem("basket", JSON.stringify(basketToSave));
    console.log("Сохраняем корзину в localStorage:", basketToSave);
  }
  setSelectedCategory(categoryKey: string) {
    runInAction(() => {
      this.selectedCategory = categoryKey;
    })

  }
   async getWorkItems(url: string) {
    console.log(`Вызван getWorkItems с URL: ${url}`);
    try {
        const response = await fetch('/api/works');
        console.log('Запрос выполнен, проверяем статус...');
        console.log('Статус ответа:', response.status);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        // Получаем ответ как текст
        const text = await response.text(); 
        console.log('Ответ от сервера:', text); // Логируем текст ответа

        // Проверяем, начинается ли ответ с { или [
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            const data = JSON.parse(text); 
            console.log('Данные после парсинга:', data);
            runInAction(() => {
                this.workItems = Array.isArray(data) ? data : [];
            });
        } else {
            console.error('Ответ не является JSON:', text);
        }
    } catch (error) {
        console.error("Ошибка при загрузке работ:", error);
    }
}



}

const catalogueStore = new CatalogueStore();
export default catalogueStore;
