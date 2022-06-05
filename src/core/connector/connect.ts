import { ConnectorWrapperWithAccounts } from './accounts'
import { IConnection, IConnector, ProviderConnectInfo } from '../../types'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
    private storage: LocalStorage | undefined

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection.options)
        this.storage = connection.options.cache.enabled ? connection.storage : undefined
    }

    protected addConnectListener() {
        this.provider?.on('connect', this.onConnect.bind(this))
    }

    protected async activate() {
        this.provider = await this.impl.connectImpl()
        this.storage?.set(this.id)
        await Promise.all([this.getAccounts(), this.getChainId()])
        this.addChainChangedListener()
        this.addAccountsChangedListener()
        this.addConnectListener()
    }

    protected async deactivate() {
        this.removeAllListeners()
        await this.impl.disconnectImpl()
        this.accounts = undefined
        this.chainId = undefined
        this.provider = undefined
        this.storage?.remove()
    }

    protected onConnect({ chainId }: ProviderConnectInfo) {
        return this.onChainChanged(chainId)
    }
}
