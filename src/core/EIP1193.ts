import { ConnectorOptions, EIP1193ExternalProvider, EIP1193Provider, ProviderRpcError } from '../types'
import { ensureChainIdAllowed, parseChainId, validateChainId } from '../helpers/chainId'

export class EIP1193ProviderWrapper {
    public provider: EIP1193Provider | null
    public accounts!: string[] | null
    public chainId!: number | null
    public error!: Error | null

    private readonly _connectorOptions: ConnectorOptions

    protected constructor(provider: EIP1193ExternalProvider, options: ConnectorOptions) {
        this.provider = provider
        this._connectorOptions = options

        this.addListener()

        if (!options.connectLazy) {
            void this.activate()
        }
    }

    addListener() {
        this.provider?.on('connect', this.onConnect)
        this.provider?.on('disconnect', this.onDisconnect)
        this.provider?.on('chainChanged', this.onChainChanged)
        this.provider?.on('accountsChanged', this.onAccountsChanged)
    }

    removeListener() {
        this.provider?.removeAllListeners()
    }

    getChainId() {
        return this.provider?.request({ method: 'eth_chainId' }) as Promise<string>
    }

    getAccounts() {
        return this.provider
            ?.request({ method: 'eth_requestAccounts' })
            .catch(() => this.provider?.request({ method: 'eth_accounts' })) as Promise<string[]>
    }

    private async activate() {
        try {
            await Promise.all([this.getChainId(), this.getAccounts()]).then(([chainId, accounts]) => {
                this.onChainChanged(chainId)
                this.onAccountsChanged(accounts)
            })
        } catch (error: unknown) {
            this.error = error as Error
        }
    }

    private deactivate() {
        this.removeListener()
        this.accounts = null
        this.chainId = null
        this.error = null
        this.provider = null
    }

    onConnect({ chainId }: { chainId: number | string }) {
        this.onChainChanged(chainId)
    }

    onDisconnect(error: ProviderRpcError | undefined) {
        this.deactivate()
        this.error = error ?? null
    }

    onChainChanged(chainId: number | string) {
        const newChainId = parseChainId(chainId)
        this.error = validateChainId(newChainId) ?? null
        const { allowedChainIds } = this._connectorOptions
        if (allowedChainIds && allowedChainIds.length > 0) {
            this.error = ensureChainIdAllowed(newChainId, allowedChainIds) ?? null
        }
        this.chainId = newChainId
    }

    onAccountsChanged(accounts: string[]) {
        this.accounts = accounts
    }
}
