import generateId from '../helpers/generateId'
import { ConnectResult, Ethereumish, IProvider, ProviderRpcError, ProviderState, ProviderType } from '../types'
import { Connector } from './Connector'
import { ensureChainIdAllowed, parseChainId, validateChainId } from '../helpers/chainId'

export abstract class AbstractProviderBase<T> implements IProvider {
    public id: string
    public name: string
    public logo: string
    public type: ProviderType
    public provider!: Ethereumish | null
    public options!: T
    public address!: string | null
    public state!: ProviderState | null
    public chainId!: number | null
    public error!: Error | null

    public _initialized: boolean

    private connector!: Connector

    protected constructor(name: string, logo: string, type: ProviderType, options: T) {
        this.id = generateId(name)
        this.name = name
        this.logo = logo
        this.type = type
        this.options = options
        this._initialized = false
    }

    _init(connector: Connector) {
        this.connector = connector
        this._initialized = true
    }

    protected abstract _connect(): ConnectResult

    async connect(): ConnectResult {
        if (!this._initialized) {
            throw new Error('Provider not initialized')
        }
        this.state = ProviderState.LOADING
        this.provider = (await this._connect()) as Ethereumish
        this.activate()
        return this.provider
    }

    disconnect(): void {
        this.deactivate()
    }

    activate() {
        this.address = 'address'
        this.chainId = 1
        this.error = null
        this.connector.provider = this
        this.state = this.error ? ProviderState.ERROR : ProviderState.CONNECTED
        this.addListener()
    }

    deactivate() {
        this.address = null
        this.state = null
        this.chainId = null
        this.error = null
        this.connector.provider = null
    }

    addListener() {
        this.provider?.on('disconnect', this.onDisconnect)
        this.provider?.on('chainChanged', this.onChainChanged)
        this.provider?.on('accountsChanged', this.onAccountsChanged)
    }

    onDisconnect(error: ProviderRpcError | undefined) {
        this.deactivate()
        this.reportError(error)
    }

    onChainChanged(chainId: number | string) {
        const newChainId = parseChainId(chainId)
        this.reportError(validateChainId(newChainId))
        const { allowedChainIds } = this.connector.options
        if (allowedChainIds) {
            this.reportError(ensureChainIdAllowed(newChainId, allowedChainIds))
        }
        this.chainId = newChainId
    }

    onAccountsChanged(accounts: string[]) {
        this.address = Array.isArray(accounts) ? accounts[0] : ''
    }

    reportError(error?: Error) {
        if (error) {
            this.error = error
            this.state = ProviderState.ERROR
        }
    }
}
