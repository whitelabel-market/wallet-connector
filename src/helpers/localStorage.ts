export default class LocalStorage {
    storage?: WindowLocalStorage['localStorage']
    enabled = false

    constructor() {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            this.storage = window.localStorage
            this.enabled = true
        }
    }

    set(key: string, data: any) {
        const jsonData = JSON.stringify(data)
        if (this.enabled) {
            this.storage?.setItem(key, jsonData)
        }
    }

    get(key: string) {
        let data = null
        let raw = null
        if (this.enabled) {
            raw = this.storage?.getItem(key)
        }
        if (raw && typeof raw === 'string') {
            try {
                data = JSON.parse(raw)
            } catch (error) {
                return null
            }
        }
        return data
    }

    remove(key: string) {
        if (this.enabled) {
            this.storage?.removeItem(key)
        }
    }

    update(key: string, data: any) {
        const localData = this.get(key) || {}
        const mergedData = {
            ...localData,
            ...data,
        }
        this.set(key, mergedData)
    }
}
