import { IConnection, IConnector, RequiredConnectionOptions } from '../../types'
import LocalStorage from '../../helpers/localStorage'
import { ConnectorFactory } from './factory'

export class Connection extends ConnectorFactory implements IConnection {
    options: RequiredConnectionOptions
    storage: LocalStorage

    constructor(options: RequiredConnectionOptions, connectors: IConnector[]) {
        super()
        this.options = options
        this.storage = new LocalStorage(this.options.cache.key)
        super.init(connectors, this)
    }

    static async init(options: RequiredConnectionOptions, connectors: IConnector[]): Promise<Connection> {
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
}
