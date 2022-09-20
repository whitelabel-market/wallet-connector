import { ConnectionOptions, IConnection, IConnector, RequiredConnectionOptions } from '../../types'
import LocalStorage from '../../helpers/localStorage'
import { ConnectorFactory } from './factory'
import { mergeDeep } from '../../helpers/mergeDeep'

const DEFAULT_OPTIONS: ConnectionOptions = {
    allowedChainIds: null,
    desiredChainOrChainId: null,
    cache: {
        enabled: true,
        key: 'cached-connector',
    },
}

const initOptions = (options: ConnectionOptions) => mergeDeep(DEFAULT_OPTIONS, options) as RequiredConnectionOptions

export class Connection extends ConnectorFactory implements IConnection {
    options: RequiredConnectionOptions
    _storage: LocalStorage

    constructor(options: ConnectionOptions, connectors: IConnector<any>[]) {
        super()
        this.options = initOptions(options)
        this._storage = new LocalStorage(this.options.cache.key)
        this._init(connectors, this)
    }

    loadFromCache() {
        if (this.options.cache?.enabled) {
            const id = this._storage.get()
            if (id) {
                if (this.connectors[id]) {
                    return this.connectors[id].connect()
                }
            }
        }
    }
}
