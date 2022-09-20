import { IConnector, RequiredConnectionOptions } from '../../types'
import { ConnectorWrapperWithChainId } from './chainId'
import { events } from './base'

export class ConnectorWrapperWithAccounts extends ConnectorWrapperWithChainId {
    accounts: string[] | undefined

    constructor(impl: IConnector, options: RequiredConnectionOptions) {
        super(impl, options)
    }

    get selectedAccount() {
        return this.accounts ? this.accounts[0] : undefined
    }

    protected _addAccountsChangedListener() {
        this.provider?.on('accountsChanged', this._onAccountsChanged.bind(this))
    }

    protected _onAccountsChanged(accounts: string[]) {
        if (!accounts.length) {
            throw new Error('No accounts returned')
        }
        this.accounts = accounts
        this.emit(events.ACCOUNTS_CHANGED, this.accounts)
        return this.accounts
    }
}
