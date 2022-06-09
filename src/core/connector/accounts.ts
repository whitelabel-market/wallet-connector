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

    protected async _getAccounts() {
        try {
            return this._onAccountsChanged(await this._getRequestAccounts())
        } catch (error: any) {
            const accounts = await this._getEthAccounts()
            if (accounts?.length) {
                return this._onAccountsChanged(accounts)
            } else {
                throw error
            }
        }
    }

    protected _onAccountsChanged(accounts: string[]) {
        if (!accounts.length) {
            throw new Error('No accounts returned')
        }
        this.accounts = accounts
        this.emit(events.ACCOUNTS_CHANGED, this.accounts)
        return this.accounts
    }

    private _getRequestAccounts() {
        return this.provider?.request({ method: 'eth_requestAccounts' }) as Promise<string[]>
    }

    private _getEthAccounts() {
        return this.provider?.request({ method: 'eth_accounts' }) as Promise<string[]>
    }
}
