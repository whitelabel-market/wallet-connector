import { ConnectorWrapperWithAccounts } from './accounts'
import { IConnection, IConnector } from '../../types'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
    private _storage: LocalStorage | undefined

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection.options)
        this._storage = connection.options.cache.enabled ? connection._storage : undefined
    }

    protected async _activate() {
        this.provider = await this._impl.connectImpl()
        await Promise.all([this._getAccounts(), this._getChainId()])
        console.log('success executing _getAccounts', this)
        this._addChainChangedListener()
        this._addAccountsChangedListener()
        console.log('set storage', this.id)
        this._storage?.set(this.id)
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
