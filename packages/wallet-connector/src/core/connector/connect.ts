import { ConnectorWrapperWithAccounts } from './accounts'
import { IConnection, IConnector } from '../../types'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
    private _storage: LocalStorage | undefined

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection.options)
        this._storage = connection.options.cache.enabled ? connection._storage : undefined
    }

    protected _removeAllListeners() {
        this.provider?.removeAllListeners()
    }

    protected async _activate() {
        this.accounts = undefined
        this.chainId = undefined
        this.error = undefined
        const { accounts, chainId } = await this._impl.connectImpl()
        this._addChainChangedListener()
        this._addAccountsChangedListener()
        await this._onChainChanged(chainId)
        this._onAccountsChanged(accounts)
        this._storage?.set(this.id)
    }

    protected async _deactivate() {
        this._removeAllListeners()
        await this._impl.disconnectImpl()
        this.accounts = undefined
        this.chainId = undefined
        this.error = undefined
        this._storage?.remove()
    }

    get connected() {
        return !!(!this.error && this.selectedAccount && this.selectedAccount.length > 0)
    }
}
