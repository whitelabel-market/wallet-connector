import { IConnector, RequiredConnectionOptions } from '../../types'
import { ConnectorWrapperWithChainId } from './chainId'

export class ConnectorWrapperWithAccounts extends ConnectorWrapperWithChainId {
    accounts: string[] | undefined

    constructor(impl: IConnector, options: RequiredConnectionOptions) {
        super(impl, options)
    }

    get selectedAccount() {
        return this.accounts ? this.accounts[0] : undefined
    }

    protected addAccountsChangedListener() {
        this.provider?.on('accountsChanged', this.onAccountsChanged.bind(this))
    }

    protected async getAccounts() {
        try {
            return this.onAccountsChanged(await this.getRequestAccounts())
        } catch (error: any) {
            const accounts = await this.getEthAccounts()
            if (accounts?.length) {
                return this.onAccountsChanged(accounts)
            } else {
                throw error
            }
        }
    }

    protected onAccountsChanged(accounts: string[]) {
        if (!accounts.length) {
            throw new Error('No accounts returned')
        }
        return (this.accounts = accounts)
    }

    private getRequestAccounts() {
        return this.provider?.request({ method: 'eth_requestAccounts' }) as Promise<string[]>
    }

    private getEthAccounts() {
        return this.provider?.request({ method: 'eth_accounts' }) as Promise<string[]>
    }
}
