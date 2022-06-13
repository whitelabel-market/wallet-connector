import { IExternalProvider } from '../types'
import { AbstractConnector } from '../core/connectorImpl/abstract'

export function createInjectedProvider(from: IExternalProvider, selector: keyof IExternalProvider) {
    // handle edge case when multiple injected providers are installed
    if (from.providers?.length) {
        return from.providers.find((p) => p[selector]) ?? from.providers[0]
    }
    return from
}

export function createConnector<T = void>(impl: AbstractConnector<T>) {
    return (args: T) => impl.initImpl(args)
}
