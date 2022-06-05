import { ConnectorWrapperConnect } from './connect'
import { ConnectorStatus, IConnection, IConnector, IConnectorWrapper } from '../../types'

export class ConnectorWrapper extends ConnectorWrapperConnect implements IConnectorWrapper {
    private connection: IConnection

    constructor(impl: IConnector, connection: IConnection) {
        super(impl, connection)
        this.connection = connection
    }

    async connect() {
        try {
            this.status = ConnectorStatus.LOADING
            this.connection.add(this)
            await this.activate()
            this.status = ConnectorStatus.CONNECTED
        } catch (error: any) {
            this.reportError(error)
        }

        return this
    }

    async disconnect() {
        try {
            this.status = ConnectorStatus.LOADING
            await this.deactivate()
            this.connection.remove(this)
            this.status = ConnectorStatus.DISCONNECTED
        } catch (error: any) {
            this.reportError(error)
        }
    }
}
