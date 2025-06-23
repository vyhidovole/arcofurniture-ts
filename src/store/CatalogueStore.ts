import BaseStore from "./BaseStore"
import {makeObservable, observable, action, runInAction} from "mobx"
import { ProductItem } from '@/types/types';

/**
 * Интерфейс для работ
 */
interface WorkItem {
    id: string
    description: string
}
/**
 * Класс для управления состоянием товара
 */
class CatalogueStore extends BaseStore {
    products: ProductItem[] = []// Инициализируем массив товаров
    workItems: WorkItem[] = []// Инициализируем массив работ
    basket: ProductItem[] = []// Корзина
    quantity: number = 0

    constructor() {
        super()
        makeObservable(this,{
            products: observable,// Делаем products наблюдаемым
            workItems: observable,// Делаем workItems наблюдаемым
            basket: observable,
            quantity: observable,
            getProducts: action,
            addProductToBasket: action,
            deleteProductFromBasket: action,
            initializeBasket: action,
            incrementProductQuantity: action,
            decrementProductQuantity: action,
            updateCount: action,
            saveToLocalStorage: action,
            clearProduct: action,
            setBasket: action,
            getWorkItems: action,

        })
    }
    /**
     * Функция для использования товаров с сервера.
     * Использует fetch для отправк запроса на сервер и обновляет массив товаров.
     */
    async getProducts(url: string): Promise<void> {
       try {
        const response = await fetch(`${this.baseUrl}${url}`)
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`)
        }
        const data: ProductItem[] = await response.json()
        runInAction(()=>{
            this.products = data // Предполагаем, что данные - это массив продуктов
        })
       }catch(error){
        console.error('Ошибка при загрузке продуктов', error)
       }
    }

    async getWorkItems(url: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`)
            if(!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`)
            }
            const data: WorkItem[] = await response.json()
            runInAction(()=>{
                this.workItems = data
            })
        }catch(error){
            console.error("Ошибка при загрузке работ:", error)
        }
    }

    addProductToBasket(item: ProductItem):void {
        console.log("Добавляем продукт в корзину:", item)// Логируем добавляемый продукт
        const existingProduct = this.basket.find(product => product.id === item.id)

        if (existingProduct) {
            // Если продукт уже есть в корзине, увеличиваем его количество
            existingProduct.quantity! +=1// Используем оператор !, чтобы указать, что quantity определено
            console.log(`Увеличиваем количество для ${item.name}: ${existingProduct.quantity}`)
        } else {
            // Если продукта нет в корзине, добавляем его
            this.basket.push({...item, quantity: 1})
            console.log(`Товар ${item.name}добавлен в корзину с количеством 1`)
        }
        // Обновляем количество уникальных товаров в корзине
        this.updateCount()
        this.saveToLocalStorage()
    }
    //Метод для установки начального состояния корзины
    setBasket(savedBasket: ProductItem[]): void {
       runInAction(()=>{
        console.log("Установка корзины:", savedBasket)// Отладочное сообщение
        this.basket = savedBasket
        this.updateCount()// Обновляем количество после установки
       })
    }
    // Метод для увеличения количества товара
    incrementProductQuantity(productId: string): void {
        const product = this.basket.find(item => item.id === productId)
        if(product) {
            product.quantity! +=1// Увеличиваем количество на 1
            this.updateCount()
        }
        console.log("количество товаров увеличено")
    }
     // Метод для уменьшения количества товара
    decrementProductQuantity(productId: string): void {
  const product = this.basket.find(item => item.id === productId);
  if (product && product.quantity !== undefined) {
    if (product.quantity > 1) {
      product.quantity -= 1; // Уменьшаем количество на 1
      this.updateCount();
    } else if (product.quantity === 1) {
      // Если количество товара 1, удаляем его из корзины
      this.deleteProductFromBasket(productId);
    }
    console.log("Количество товаров уменьшено");
  } else {
    console.warn(`Товар с id ${productId} не найден в корзине или отсутствует quantity`);
  }
}
/**
 * Удаляет товар из карзины по его ID.
 * @param itemId - ID товара, который нужно удалить.
 */
deleteProductFromBasket(itemId:string): void {
    console.log("Удаляем товар с ID", itemId)
    console.log("Текущая корзина", this.basket)

    runInAction(()=> {
        const existingProduct = this.basket.find(item => item.id === itemId)

        if(existingProduct) {
            const itemIndex = this.basket.findIndex(item => item.id === itemId)
            if (itemIndex !==-1) {
                this.basket.splice(itemIndex,1)// Удаляем товар из корзины
            }
            this.updateCount()//Обновляем количество уникальных товаров
            this.saveToLocalStorage()// Сохраняем изменения в localStorage
        } else {
            console.error("ТОвар не найден в корзине с ID:", itemId)
        }
    })
}

/**
 * Обновление количества товаров в корзине.
 */
updateCount(): void {
    this.quantity = this.basket.reduce((total,product)=> total + (product.quantity ?? 0), 0)
     console.log("Обновлено количество товаров в корзине:", this.quantity);
}
/**
 * Сохраняет текущую корзину и количество товаров в localStorage.
 */
saveToLocalStorage(): void {
    try{
        if (typeof window !== 'undefined'){
            localStorage.setItem("basket", JSON.stringify(this.basket))
            localStorage.setItem("quantity",this.quantity.toString())
            console.log("Сохранено в localStorage:", this.basket, this.quantity)
        }
    }catch(error){
        console.error("Ошибка при сохранении в localStorage:", error)
    }
}
/**
 * Инициализация корзины из localStorage.
 */
initializeBasket(): void {
    if (typeof window !=='undefined') {
        const savedBasketJson = localStorage.getItem("basket")
        if(savedBasketJson){
            try {
                const savedBasket:ProductItem[] = JSON.parse(savedBasketJson)
                runInAction(()=> {
                    this.basket = savedBasket
                    this.updateCount()
                })
                console.log("Корзина инициализированна:", this.basket)
            } catch(error) {
                console.error("Ошибка при парсинге корзины из localStorage:", error)
            }
        }
    }else {
        console.warn("localStorage недоступен, инициализация корзмны не выполнена.")
    }
}
/**
 * Полностью очищает корзину от товара с указанным id.
 * @param id - ID товара для удаления.
 */
clearProduct(id: string): void {
    this.basket = this.basket.filter(item=> item.id !==id)
    this.updateCount()
    console.log("Корзина очищена")
}
}
const catalogueStore = new CatalogueStore();
catalogueStore.initializeBasket();

export default catalogueStore;