import { ConnectorWrapperWithAccounts } from './accounts'
import { IConnection, IConnector } from '../../types'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
    private _storage: LocalStorage | undefined

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection.options)
        this._storage = connection.options.cache.enabled ? connection.storage : undefined
    }

    protected async _activate() {
        this.provider = await this._impl.connectImpl()
        this._storage?.set(this.id)
        await Promise.all([this._getAccounts(), this._getChainId()])
        this._addChainChangedListener()
        this._addAccountsChangedListener()
    }

    protected async _deactivate() {
        this._removeBaseListeners()
        await this._impl.disconnectImpl()
        this.accounts = undefined
        this.chainId = undefined
        this.provider = undefined
        this.error = undefined
        this._storage?.remove()
    }

    get connected() {
        return !!(!this.error && this.selectedAccount && this.selectedAccount.length > 0)
    }
}
