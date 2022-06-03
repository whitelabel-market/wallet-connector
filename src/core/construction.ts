import { AbstractConnector, ConnectionOptions, ConnectionParams, DeepRequired } from '../types'
import { Connection } from './connection'
import { mergeDeep } from '../helpers/mergeDeep'

const DEFAULT_OPTIONS = {
    allowedChainIds: null,
    cache: {
        enabled: true,
        key: 'cached-connector',
    },
}

export function initOptions(options: ConnectionOptions) {
    return mergeDeep(DEFAULT_OPTIONS, options) as DeepRequired<ConnectionOptions>
}

export function initConnection({ options, connectors }: ConnectionParams) {
    return Connection.init(options, connectors)
}

export function createConnector<T = void>(impl: AbstractConnector<T>) {
    return (options?: T) => impl.init(options || ({} as T))
}
