import { ConnectorOptions, IProvider } from '../types'
import LocalStorage from '../helpers/localStorage'

export class Connector {
    public options: ConnectorOptions
    public provider!: IProvider | null
    private readonly _providers: IProvider[]

    constructor(options: ConnectorOptions, providers: IProvider[]) {
        this.options = options
        this._providers = providers
    }

    static async init(options: ConnectorOptions, providers: IProvider[]): Promise<Connector> {
        const connector = new Connector(options, providers)
        connector._providers.forEach((p) => p._init(connector))
        connector.provider = await connector.loadProviderCache(providers)
        return connector
    }

    async loadProviderCache(providers: IProvider[]) {
        let cachedProvider = null
        const localStorage = new LocalStorage(this.options.cache.key)
        const providerId = localStorage.get()
        if (providerId) {
            const providerById = providers.find((p) => p.id === providerId)
            if (providerById) {
                cachedProvider = await providerById.connect()
            }
        }
        return cachedProvider
    }

    listProviders() {
        return this._providers
    }
}
