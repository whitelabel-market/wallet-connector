import { ConnectionOptions, IConnector, IConnectorWrapper, RequiredConnectorState } from '../types'
import LocalStorage from '../helpers/localStorage'
import { createConnectorWrapper } from './connector/construction'
import { StateProxy } from './state'
import { getDefaultState } from './options'

export class Connection extends StateProxy {
    public connectors!: IConnectorWrapper[]
    private storage: LocalStorage

    constructor(initialState: RequiredConnectorState, storage: LocalStorage) {
        super(initialState)
        this.storage = storage
    }

    static async init(options: ConnectionOptions, connectors: IConnector[]): Promise<Connection> {
        const state = getDefaultState(options)
        const storage = new LocalStorage(state.options.cache.key)
        const connection = new Connection(state, storage)
        connection.connectors = connectors.map((impl) => createConnectorWrapper(impl, { connection, state, storage }))
        if (state.options.cache?.enabled) {
            await connection.loadCachedConnector()
        }
        return connection
    }

    async loadCachedConnector() {
        const connectorId = this.storage.get()
        if (connectorId) {
            const connectorById = this.connectors.find((c) => c.id === connectorId)
            if (connectorById) {
                await connectorById.connect()
            }
        }
        return null
    }
}
