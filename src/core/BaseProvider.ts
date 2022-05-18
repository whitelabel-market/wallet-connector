import generateId from '../helpers/generateId'
import LocalStorage from '../helpers/localStorage'
import { parseChainId, validateChainId } from '../helpers/chainId'

export abstract class BaseProvider implements IProvider {
    public id: string
    public name: string
    public logo: string
    public type: ProviderType
    private localStorage!: LocalStorage
    private options!: ConnectorOptions

    static CACHED_PROVIDER_KEY = 'CACHED_PROVIDER'

    protected constructor(name: string, logo: string, type: ProviderType) {
        this.id = generateId(name)
        this.name = name
        this.logo = logo
        this.type = type
    }

    init(options: ConnectorOptions, localStorage: LocalStorage) {
        this.options = options
        this.localStorage = localStorage
        return this
    }

    protected abstract onConnect(options: ConnectorOptions): ConnectResult

    async connect() {
        if (!this.options) {
            return null
        }
        const provider = await this.onConnect(this.options)
        const chainId = parseChainId(provider.chainId)
        validateChainId(chainId, this.options.chainId || 1)
        this.localStorage.set(BaseProvider.CACHED_PROVIDER_KEY, this.id)
        return provider
    }
}
