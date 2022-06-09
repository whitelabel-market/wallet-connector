import { ConnectionOptions, IConnection, IConnector, RequiredConnectionOptions } from '../../types'
import LocalStorage from '../../helpers/localStorage'
import { ConnectorFactory } from './factory'
import { mergeDeep } from '../../helpers/mergeDeep'

const DEFAULT_OPTIONS = {
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
    storage: LocalStorage

    constructor(options: ConnectionOptions, connectors: IConnector[]) {
        super()
        this.options = initOptions(options)
        this.storage = new LocalStorage(this.options.cache.key)
        super.init(connectors, this)
    }

    loadFromCache() {
        if (this.options.cache?.enabled) {
            const id = this.storage.get()
            if (id) {
                if (this.connectors[id]) {
                    return this.connectors[id].connect()
                }
            }
        }
    }
}
