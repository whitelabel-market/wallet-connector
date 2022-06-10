import { AbstractConnector, IExternalProvider } from '../types'

export function peerImport(name: string, prop?: string) {
    const pkg = import(name) as any

    if (prop) {
        return pkg.default().then(({ [prop]: value }: any) => value)
    } else {
        return pkg.default
    }
}

export function createInjectedProvider(from: IExternalProvider, selector: keyof IExternalProvider) {
    // handle edge case when multiple injected providers are installed
    if (from.providers?.length) {
        return from.providers.find((p) => p[selector]) ?? from.providers[0]
    }
    return from
}

export function createConnector<T = void>(impl: AbstractConnector<T>) {
    return (options?: T) => impl.init(options || ({} as T))
}
