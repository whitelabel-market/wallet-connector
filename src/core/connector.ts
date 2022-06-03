import { ConnectorOptions, IProvider, IProviderWrapper, RequiredConnectorState } from '../types'
import LocalStorage from '../helpers/localStorage'
import { createProviderWrapper } from './provider/construction'
import { StateProxy } from './state'
import { getDefaultState } from './options'

export class Connector extends StateProxy {
    public providers!: IProviderWrapper[]
    private storage: LocalStorage

    constructor(initialState: RequiredConnectorState, storage: LocalStorage) {
        super(initialState)
        this.storage = storage
    }

    static async init(options: ConnectorOptions, providers: IProvider[]): Promise<Connector> {
        const state = getDefaultState(options)
        const storage = new LocalStorage(state.options.cache.key)
        const connector = new Connector(state, storage)
        connector.providers = providers.map((impl) => createProviderWrapper(impl, { connector, state, storage }))
        if (state.options.cache?.enabled) {
            await connector.loadCachedProvider()
        }
        return connector
    }

    async loadCachedProvider() {
        const providerId = this.storage.get()
        if (providerId) {
            const providerById = this.providers.find((p) => p.id === providerId)
            if (providerById) {
                await providerById.connect()
            }
        }
        return null
    }
}
