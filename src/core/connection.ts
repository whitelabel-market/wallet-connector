import { ConnectionOptions, DeepRequired, IConnector, IConnectorWrapper } from '../types'
import LocalStorage from '../helpers/localStorage'
import { initOptions } from './construction'
import { ConnectorWrapper } from './connectorWrapper'

export interface IConnection {
    options: DeepRequired<ConnectionOptions>
    connectors: IConnectorWrapper[]
    activeConnectors: IConnectorWrapper[]
    activeConnector: IConnectorWrapper | undefined
}

export class Connection implements IConnection {
    options: DeepRequired<ConnectionOptions>
    connectors: IConnectorWrapper[]
    activeConnectors: IConnectorWrapper[]
    storage: LocalStorage

    constructor(options: ConnectionOptions, connectors: IConnector[]) {
        this.options = initOptions(options)
        this.storage = new LocalStorage(this.options.cache.key)
        this.activeConnectors = []
        this.connectors = connectors.map((impl) => new ConnectorWrapper(impl, this))
    }

    static async init(options: ConnectionOptions, connectors: IConnector[]): Promise<Connection> {
        const connection = new Connection(options, connectors)
        if (connection.options.cache?.enabled) {
            const id = connection.storage.get()
            if (id) {
                const connectorById = connection.connectors.find((c) => c.id === id)
                if (connectorById) {
                    await connectorById.connect()
                }
            }
        }
        return connection
    }

    get activeConnector() {
        return this.activeConnectors.length > 0 ? this.activeConnectors[0] : undefined
    }
}
