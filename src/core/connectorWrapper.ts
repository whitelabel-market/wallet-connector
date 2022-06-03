import {
    ConnectorStatus,
    IConnector,
    IConnectorWrapper,
    IExternalProvider,
    ProviderConnectInfo,
    ProviderRpcError,
} from '../types'
import { Connection } from './connection'
import { ensureChainIdAllowed, parseChainId, validateChainId } from '../helpers/chainId'

export class ConnectorWrapper implements IConnectorWrapper {
    provider: IExternalProvider | undefined
    accounts: string[] | undefined
    chainId: number | undefined
    error: Error | undefined
    status: ConnectorStatus

    constructor(private readonly impl: IConnector, private readonly connection: Connection) {
        this.status = ConnectorStatus.DISCONNECTED
    }

    get id() {
        return this.impl.id
    }

    get name() {
        return this.impl.name
    }

    get logo() {
        return this.impl.logo
    }

    get selectedAccount() {
        return this.accounts ? this.accounts[0] : undefined
    }

    private addListener() {
        this.provider?.on('connect', this.onConnect)
        this.provider?.on('disconnect', this.onDisconnect)
        this.provider?.on('chainChanged', this.onChainChanged)
        this.provider?.on('accountsChanged', this.onAccountsChanged)
    }

    private removeListener() {
        this.provider?.removeAllListeners()
    }

    private async enable() {
        await Promise.all([
            this.provider?.request({ method: 'eth_requestAccounts' }).catch((error) =>
                (this.provider?.request({ method: 'eth_accounts' }) as Promise<string[]>).then((accounts) => {
                    if (accounts?.length) {
                        return accounts
                    } else {
                        throw error
                    }
                })
            ) as Promise<string[]>,
            this.provider?.request({ method: 'eth_chainId' }) as Promise<string>,
        ]).then(([accounts, chainId]) => {
            this.onChainChanged(chainId)
            this.onAccountsChanged(accounts)
        })
        this.addListener()
    }

    private disable(error?: Error, status?: ConnectorStatus) {
        this.removeListener()
        this.accounts = undefined
        this.chainId = undefined
        this.provider = undefined
        const i = this.connection.activeConnectors.findIndex((c) => c.id === this.id)
        this.connection.activeConnectors.splice(i, 1)
        if (error) {
            this.onError(error)
        } else {
            this.error = undefined
            this.status = status ?? ConnectorStatus.DISCONNECTED
        }
    }

    async connect() {
        try {
            this.status = ConnectorStatus.LOADING
            this.provider = await this.impl.connectImpl()
            await this.enable()
            this.connection.activeConnectors.unshift(this)
            this.status = ConnectorStatus.CONNECTED

            if (this.connection.options.cache.enabled) {
                this.connection.storage.set(this.id)
            }
        } catch (error: any) {
            this.provider = undefined
            this.onError(error)
        }

        return this
    }

    async disconnect() {
        try {
            this.status = ConnectorStatus.LOADING
            await this.impl.disconnectImpl()
            this.disable()
            if (this.connection.options.cache.enabled) {
                this.connection.storage.remove()
            }
        } catch (error: any) {
            this.provider = undefined
            this.onError(error)
        }
    }

    private onConnect({ chainId }: ProviderConnectInfo) {
        this.onChainChanged(chainId)
    }

    private onDisconnect(error: ProviderRpcError | undefined) {
        this.disable(error, ConnectorStatus.ERROR)
    }

    private onChainChanged(newChainId: number | string) {
        const chainId = parseChainId(newChainId)
        let error = validateChainId(chainId) ?? undefined
        const { allowedChainIds } = this.connection.options
        if (allowedChainIds && allowedChainIds.length > 0) {
            error = ensureChainIdAllowed(chainId, allowedChainIds) ?? undefined
        }
        this.chainId = chainId
        if (error) {
            this.onError(error)
        }
    }

    private onAccountsChanged(accounts: string[]) {
        if (accounts.length) {
            this.accounts = accounts
        } else {
            this.onError(new Error('No accounts returned'))
        }
    }

    private onError(error: Error) {
        this.error = error
        this.status = ConnectorStatus.ERROR
        throw error
    }
}
