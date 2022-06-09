export default class LocalStorage {
    storage?: WindowLocalStorage['localStorage']
    enabled = false

    constructor(public key: string) {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            this.storage = window.localStorage
            this.enabled = true
        }
    }

    set(data: any) {
        const jsonData = JSON.stringify(data)
        if (this.enabled) {
            this.storage?.setItem(this.key, jsonData)
        }
    }

    get() {
        let data = null
        let raw = null
        if (this.enabled) {
            raw = this.storage?.getItem(this.key)
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

    remove() {
        if (this.enabled) {
            this.storage?.removeItem(this.key)
        }
    }

    update(data: any) {
        const localData = this.get() || {}
        const mergedData = {
            ...localData,
            ...data,
        }
        this.set(mergedData)
    }
}
