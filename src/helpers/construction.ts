import { AbstractConnector } from '../types'

export function createConnector<T = void>(impl: AbstractConnector<T>) {
    return (options?: T) => impl.init(options || ({} as T))
}
