import { ConnectorWrapperConnect } from './connect'
import { IConnection, IConnector, IConnectorWrapper } from '../../types'
import { events } from './base'

export class ConnectorWrapper extends ConnectorWrapperConnect implements IConnectorWrapper {
    private _connection: IConnection

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection)
        this._connection = connection
    }

    /**
     * Connect to a provider.
     */
    async connect() {
        try {
            this.loading = true
            this._connection._add(this)
            await this._activate()
            this.emit(events.CONNECT, this)
            this.loading = false
        } catch (error: any) {
            console.log('received error', error)
            this._reportError(error)
            this._connection._remove(this)
        }

        return this
    }

    /**
     * Disconnect a provider.
     */
    async disconnect() {
        try {
            this.loading = true
            await this._deactivate()
            this._connection._remove(this)
            this.loading = false
            this.emit(events.DISCONNECT, this)
        } catch (error: any) {
            this._reportError(error)
            this._connection._remove(this)
        }
    }
}
