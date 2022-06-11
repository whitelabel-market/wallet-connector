import { AbstractConnector, IExternalProvider } from '../types'

export async function peerImport(name: string, prop?: string) {
    const pkg = (await import(name)) as any
    console.log('got pkg', pkg)
    return (prop ? await pkg.default().then(({ [prop]: v }: any) => v) : pkg.default) as any
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
