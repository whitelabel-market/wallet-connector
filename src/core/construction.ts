import { AbstractConnector, ConnectionOptions, IConnectionParams, RequiredConnectionOptions } from '../types'
import { Connection } from './connection/connection'
import { mergeDeep } from '../helpers/mergeDeep'

const DEFAULT_OPTIONS = {
    allowedChainIds: null,
    cache: {
        enabled: true,
        key: 'cached-connector',
    },
}

function initOptions(options: ConnectionOptions) {
    return mergeDeep(DEFAULT_OPTIONS, options) as RequiredConnectionOptions
}

export function initConnection({ options, connectors }: IConnectionParams) {
    return Connection.init(initOptions(options), connectors)
}

export function createConnector<T = void>(impl: AbstractConnector<T>) {
    return (options?: T) => impl.init(options || ({} as T))
}
