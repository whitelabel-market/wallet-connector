import generateId from '../helpers/generateId'

export type DeepRequired<T> = { [K in keyof T]: DeepRequired<T[K]> } & Required<T>

export enum ProviderType {
    INJECTED,
    QRCODE,
    WEB,
}

export enum ProviderStatus {
    LOADING = 'loading',
    ERROR = 'error',
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
}

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

export type ConnectorOptions = {
    allowedChainIds?: number[] | null
    cache?: {
        enabled?: boolean
        key?: string
    }
}

export type ConnectorState = {
    options?: DeepRequired<ConnectorOptions>
    provider?: IProviderWrapper | undefined
    accounts?: string[] | undefined
    chainId?: number | undefined
    error?: Error | undefined
    status?: ProviderStatus
}

export type RequiredConnectorState = DeepRequired<ConnectorState>

export interface IProviderInfo {
    id: string
    name: string
    logo: string
}

export interface IProvider extends IProviderInfo {
    type: ProviderType

    connectImpl(): ConnectResult
    disconnectImpl(): void
}

export interface IProviderWrapper extends IProviderInfo {
    options: ConnectorOptions
    accounts: string[] | undefined
    chainId: number | undefined
    error: Error | undefined

    connect: () => Promise<IProvider>
    disconnect: () => void
}

export abstract class AbstractProvider<T = void> implements IProvider {
    id: string
    options!: T

    protected constructor(public name: string, public logo: string, public type: ProviderType) {
        this.id = generateId(this.name)
    }

    init(options: T): IProvider {
        this.options = options
        console.log('init options', options)
        return this
    }

    abstract connectImpl(): ConnectResult
    abstract disconnectImpl(): void
}
