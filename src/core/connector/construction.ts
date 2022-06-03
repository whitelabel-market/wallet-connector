import { ConnectorWrapper } from './wrapper'
import { AbstractConnector, IConnector, RequiredConnectorState } from '../../types'
import { Connection } from '../connection'
import LocalStorage from '../../helpers/localStorage'

export const createConnectorWrapper = (
    impl: IConnector,
    params: { connection: Connection; state: RequiredConnectorState; storage: LocalStorage }
) => {
    return new ConnectorWrapper(impl, params)
}

export const createConnector = <T = void>(impl: AbstractConnector<T>) => {
    return (options?: T) => impl.init(options || ({} as T))
}
