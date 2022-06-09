import { IConnector, IConnectorFactory, IConnectorWrapper, IConnection } from '../../types'
import { ConnectorWrapper } from '../connector/wrapper'
import EventEmitter from 'eventemitter3'
import { events } from '../connector/base'

export class ConnectorFactory extends EventEmitter implements IConnectorFactory {
    connectors: Record<string, IConnectorWrapper>
    activeConnectors: Record<string, IConnectorWrapper>

    activeConnector: IConnectorWrapper | undefined

    constructor() {
        super()
        this.activeConnectors = {}
        this.connectors = {}
    }

    _init(connectors: IConnector[], connection: IConnection) {
        connectors.forEach((impl) => {
            const connector = new ConnectorWrapper(impl, connection)
            Object.values(events).forEach((event) =>
                connector.on(event, (data) => {
                    this.emit(event, data, connector)
                })
            )
            this.connectors[connector.id] = connector
        })
    }

    _add(connector: IConnectorWrapper) {
        this.activeConnectors[connector.id] = connector
        this.activeConnector = connector
    }

    _remove(connector: IConnectorWrapper) {
        this.activeConnectors[connector.id] && delete this.activeConnectors[connector.id]
        const activeConnectors = Object.values(this.activeConnectors)
        this.activeConnector = activeConnectors.length > 0 ? activeConnectors[activeConnectors.length - 1] : undefined
    }
}
