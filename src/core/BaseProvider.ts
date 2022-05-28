import generateId from '../helpers/generateId'
import { ConnectResult, Ethereumish, IProvider, ProviderRpcError, ProviderState, ProviderType } from '../types'
import { ConnectorFactory } from './ConnectorFactory'
import { ensureChainIdAllowed, parseChainId, validateChainId } from '../helpers/chainId'

export abstract class AbstractProviderBase<T> implements IProvider {
    public id: string
    public name: string
    public logo: string
    public type: ProviderType
    public provider!: Ethereumish | null
    public options!: T
    public accounts!: string[] | null
    public state!: ProviderState | null
    public chainId!: number | null
    public error!: Error | null

    private wrapper!: ConnectorFactory

    protected constructor(name: string, logo: string, type: ProviderType, options: T) {
        this.id = generateId(name)
        this.name = name
        this.logo = logo
        this.type = type
        this.options = options
    }

    _init(wrapper: ConnectorFactory) {
        this.wrapper = wrapper
    }

    protected abstract _connect(): ConnectResult

    async connect(): ConnectResult {
        this.state = ProviderState.LOADING
        this.provider = await this._connect()
        await this.activate()
        return this.provider
    }

    disconnect(): void {
        this.deactivate()
    }

    async activate() {
        try {
            const getChainId = this.provider?.request({ method: 'eth_chainId' }) as Promise<string>
            const getAccounts = this.provider
                ?.request({ method: 'eth_requestAccounts' })
                .catch(() => this.provider?.request({ method: 'eth_accounts' })) as Promise<string[]>

            await Promise.all([getChainId, getAccounts]).then(([chainId, accounts]) => {
                this.onChainChanged(chainId)
                this.onAccountsChanged(accounts)
            })
        } catch (error: unknown) {
            this.error = error as Error
        }
        this.wrapper.activeConnector = this
        this.state = this.error ? ProviderState.ERROR : ProviderState.CONNECTED
        this.addListener()
    }

    deactivate() {
        this.accounts = null
        this.state = null
        this.chainId = null
        this.error = null
        this.wrapper.activeConnector = null
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
        const { allowedChainIds } = this.wrapper.options
        if (allowedChainIds && allowedChainIds.length > 0) {
            this.reportError(ensureChainIdAllowed(newChainId, allowedChainIds))
        }
        this.chainId = newChainId
    }

    onAccountsChanged(accounts: string[]) {
        this.accounts = accounts
    }

    reportError(error?: Error) {
        if (error) {
            this.error = error
            this.state = ProviderState.ERROR
        }
    }
}
