import generateId from '../helpers/id'
import LocalStorage from '../helpers/localStorage'

export type DeepRequired<T> = { [K in keyof T]: DeepRequired<T[K]> } & Required<T>

// per EIP-1193
export interface RequestArguments {
    readonly method: string
    readonly params?: readonly unknown[] | object
}

// per EIP-1193
export interface ProviderConnectInfo {
    readonly chainId: string
}

// per EIP-1193
export interface ProviderRpcError extends Error {
    message: string
    code: number
    data?: unknown
}

// per EIP-3085
// Interface for adding a new Ethereum chain to the wallet
export interface AddEthereumChainParameter {
    chainId: string
    blockExplorerUrls?: string[]
    chainName?: string
    iconUrls?: string[]
    nativeCurrency?: {
        name: string
        symbol: string
        decimals: number
    }
    rpcUrls?: string[]
}

// per EIP-3326
export interface SwitchEthereumChainParameter {
    chainId: string
}

// per EIP-747
// Interface to add a new token to the wallet
export interface WatchAssetParameters {
    type: string // The asset's interface, e.g. 'ERC20'
    options: {
        address: string // The hexadecimal Ethereum address of the token contract
        symbol?: string // A ticker symbol or shorthand, up to 5 alphanumerical characters
        decimals?: number // The number of asset decimals
        image?: string // A string url of the token logo
    }
}

export interface ProviderMessage {
    readonly type: string
    readonly data: unknown
}

export interface EthereumEvent {
    connect: ProviderConnectInfo
    disconnect: ProviderRpcError
    accountsChanged: string[]
    chainChanged: string
    message: ProviderMessage
    block: string
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface IExternalProvider {
    chainId: string
    isMetaMask?: boolean
    isStatus?: boolean
    networkVersion: string
    selectedAddress: string
    connected?: boolean

    on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
    enable(): Promise<string[]>
    request(args: RequestArguments): Promise<unknown>
    removeAllListeners: () => void

    /**
     * @deprecated
     */
    send?: (...args: unknown[]) => unknown
    sendAsync?: (
        request: { method: string; params?: Array<any> },
        callback: (error: any, response: any) => void
    ) => void
}

export type ConnectResult = Promise<IExternalProvider>

export type ConnectionOptions = {
    allowedChainIds?: number[] | null
    desiredChainOrChainId?: number | AddEthereumChainParameter
    cache?: {
        enabled?: boolean
        key?: string
    }
}

export type RequiredConnectionOptions = DeepRequired<ConnectionOptions>

export interface IConnectorInfo {
    id: string
    name: string
    logo: string
}

export interface IConnector extends IConnectorInfo {
    connectImpl(): ConnectResult
    disconnectImpl(): void
}

export interface IConnectorWrapper extends IConnectorInfo {
    provider: IExternalProvider | undefined
    accounts: string[] | undefined
    chainId: number | undefined
    selectedAccount: string | undefined

    error: Error | undefined
    loading: boolean
    connected: boolean

    connect: () => Promise<IConnectorWrapper>
    disconnect: () => void
}

export interface IConnectorFactory {
    connectors: Record<string, IConnectorWrapper>
    activeConnectors: Record<string, IConnectorWrapper>
    activeConnector: IConnectorWrapper | undefined

    add(wrapper: IConnectorWrapper): void
    remove(wrapper: IConnectorWrapper): void
    init(connectors: IConnector[], wrapper: IConnection): void
}

export interface IConnection extends IConnectorFactory {
    options: RequiredConnectionOptions
    storage: LocalStorage
}

export abstract class AbstractConnector<T = void> implements IConnector {
    id: string
    options!: T

    protected constructor(public name: string, public logo: string) {
        this.id = generateId(this.name)
    }

    init(options: T): IConnector {
        this.options = options
        return this
    }

    abstract connectImpl(): ConnectResult
    abstract disconnectImpl(): void
}
