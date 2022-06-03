import { ProviderWrapper } from './wrapper'
import { AbstractProvider, IProvider, RequiredConnectorState } from '../../types'
import { Connector } from '../connector'
import LocalStorage from '../../helpers/localStorage'

export const createProviderWrapper = (
    impl: IProvider,
    params: { connector: Connector; state: RequiredConnectorState; storage: LocalStorage }
) => {
    return new ProviderWrapper(impl, params)
}

export const createProvider = <T = void>(impl: AbstractProvider<T>) => {
    return (options?: T) => impl.init(options || ({} as T))
}
