import { ConnectorWrapperConnect } from './connect'
import { ConnectorStatus, IConnection, IConnector, IConnectorWrapper } from '../../types'

export class ConnectorWrapper extends ConnectorWrapperConnect implements IConnectorWrapper {
    private _connection: IConnection

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection)
        this._connection = connection
    }

    async connect() {
        try {
            this._connection.add(this)
            await super._connect()
            await this._activate()
        } catch (error: any) {
            this.provider = undefined
            this._reportError(error)
        }

        return this
    }

    async disconnect() {
        try {
            await this._disconnect()
            this._deactivate()
            this._connection.remove(this)
        } catch (error: any) {
            this.provider = undefined
            this._reportError(error)
        }
    }

    private async _activate() {
        await Promise.all([super._getAccounts(), super._getChainId()])
        super._addChainChangedListener()
        super._addAccountsChangedListener()
        super._addConnectListener()
    }

    private _deactivate(error?: Error, status?: ConnectorStatus) {
        super._baseRemoveAllListeners()
        this.accounts = undefined
        this.chainId = undefined
        this.provider = undefined
        if (error) {
            this._reportError(error)
        } else {
            this.error = undefined
            this.status = status ?? ConnectorStatus.DISCONNECTED
        }
    }
}
