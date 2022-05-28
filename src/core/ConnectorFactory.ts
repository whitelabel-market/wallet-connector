import { ConnectorOptions, IProvider } from '../types'
import LocalStorage from '../helpers/localStorage'
import { mergeDeep } from '../helpers/mergeDeep'

const DEFAULT_OPTIONS = {
    allowedChainIds: null,
    connectLazy: false,
    cache: {
        enabled: true,
        key: 'CACHED_CONNECTOR',
    },
}

export class ConnectorFactory {
    public options: Required<ConnectorOptions>
    public activeConnector!: IProvider | null
    public connectors: IProvider[]
    private storage: LocalStorage

    constructor(options: ConnectorOptions, connectors: IProvider[]) {
        this.options = mergeDeep(DEFAULT_OPTIONS, options)
        this.connectors = connectors
        this.storage = new LocalStorage(this.options.cache.key)
    }

    static async init(options: ConnectorOptions, providers: IProvider[]): Promise<ConnectorFactory> {
        const wrapper = new ConnectorFactory(options, providers)
        wrapper.connectors.forEach((p) => p._init(wrapper))
        wrapper.activeConnector = await wrapper.loadCachedConnector()
        return wrapper
    }

    async loadCachedConnector() {
        const connectorId = this.storage.get()
        if (connectorId) {
            const connectorById = this.connectors.find((p) => p.id === connectorId)
            if (connectorById) {
                await connectorById.connect()
                return connectorById
            }
        }
        return null
    }
}
