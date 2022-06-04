import { ConnectorWrapperWithAccounts } from './accounts'
import { ConnectorStatus, IConnection, IConnector, ProviderConnectInfo } from '../../types'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
    private _storage: LocalStorage | undefined

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection.options.allowedChainIds)
        this._storage = connection.options.cache.enabled ? connection.storage : undefined
    }

    protected _addConnectListener() {
        this.provider?.on('connect', this._onConnect)
    }

    protected async _connect() {
        this.status = ConnectorStatus.LOADING
        this.provider = await this.impl.connectImpl()
        this._storage?.set(this.id)
        this.status = ConnectorStatus.CONNECTED
    }

    protected async _disconnect() {
        this.status = ConnectorStatus.LOADING
        await this.impl.disconnectImpl()
        this._storage?.remove()
        this.status = ConnectorStatus.DISCONNECTED
    }

    protected _onConnect({ chainId }: ProviderConnectInfo) {
        super._onChainChanged(chainId)
    }
}
