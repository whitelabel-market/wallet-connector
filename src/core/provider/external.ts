import {
    IExternalProvider,
    ProviderConnectInfo,
    ProviderRpcError,
    ProviderStatus,
    ConnectorState,
    RequiredConnectorState,
} from '../../types'
import { ensureChainIdAllowed, parseChainId, validateChainId } from '../../helpers/chainId'
import { StateProxy } from '../state'
import { Connector } from '../connector'
import LocalStorage from '../../helpers/localStorage'

export class ExternalProviderProxy extends StateProxy {
    protected _provider!: IExternalProvider | undefined
    protected _connector: Connector
    protected _storage: LocalStorage

    constructor({
        connector,
        state,
        storage,
    }: {
        connector: Connector
        state: RequiredConnectorState
        storage: LocalStorage
    }) {
        super(state)
        this._connector = connector
        this._storage = storage
    }

    protected _patchGlobalState(state: ConnectorState) {
        this._connector.patchState(state)
        super.patchState(state)
    }

    protected addListener() {
        this._provider?.on('connect', this.onConnect)
        this._provider?.on('disconnect', this.onDisconnect)
        this._provider?.on('chainChanged', this.onChainChanged)
        this._provider?.on('accountsChanged', this.onAccountsChanged)
    }

    protected async enable(provider: IExternalProvider) {
        this._provider = provider
        await Promise.all([
            this._provider?.request({ method: 'eth_requestAccounts' }).catch((error) =>
                (this._provider?.request({ method: 'eth_accounts' }) as Promise<string[]>).then((accounts) => {
                    if (accounts?.length) {
                        return accounts
                    } else {
                        throw error
                    }
                })
            ) as Promise<string[]>,
            this._provider?.request({ method: 'eth_chainId' }) as Promise<string>,
            // this._provider?.request({ method: 'eth_accounts' }) as Promise<string[]>,
        ]).then(([accounts, chainId]) => {
            this.onChainChanged(chainId)
            this.onAccountsChanged(accounts)
        })
    }

    protected disable(error?: Error, status?: ProviderStatus) {
        this._provider?.removeAllListeners()
        this._provider = undefined
        this._patchGlobalState({
            accounts: undefined,
            chainId: undefined,
            error: error ?? undefined,
            status: status ?? ProviderStatus.DISCONNECTED,
            provider: undefined,
        })
    }

    private onConnect({ chainId }: ProviderConnectInfo) {
        this.onChainChanged(chainId)
    }

    private onDisconnect(error: ProviderRpcError | undefined) {
        this.disable(error, ProviderStatus.ERROR)
    }

    private onChainChanged(newChainId: number | string) {
        const chainId = parseChainId(newChainId)
        let error = validateChainId(chainId) ?? undefined
        const { allowedChainIds } = this._connector.options
        if (allowedChainIds && allowedChainIds.length > 0) {
            error = ensureChainIdAllowed(chainId, allowedChainIds) ?? undefined
        }
        this._patchGlobalState(error ? { chainId, error, status: ProviderStatus.ERROR } : { chainId })
    }

    private onAccountsChanged(accounts: string[]) {
        if (accounts.length) {
            this._patchGlobalState({ accounts })
        } else {
            throw new Error('No accounts returned')
        }
    }
}
