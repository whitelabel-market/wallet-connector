import { IConnector, IConnectorFactory, IConnectorWrapper, IConnection } from '../../types'
import { ConnectorWrapper } from '../connector/wrapper'

export class ConnectorFactory implements IConnectorFactory {
    connectors!: IConnectorWrapper[]
    activeConnectors: IConnectorWrapper[]

    constructor() {
        this.activeConnectors = []
    }

    init(connectors: IConnector[], connection: IConnection) {
        this.connectors = connectors.map((impl) => new ConnectorWrapper(impl, connection))
    }

    add(connector: IConnectorWrapper) {
        this.activeConnectors.unshift(connector)
    }

    remove(connector: IConnectorWrapper) {
        const i = this.activeConnectors.findIndex((c) => c.id === connector.id)
        if (i > -1) {
            this.activeConnectors.splice(i, 1)
        }
    }

    get activeConnector() {
        return this.activeConnectors.length > 0 ? this.activeConnectors[0] : undefined
    }
}
