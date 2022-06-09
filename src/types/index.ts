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

/**
 * wallet-connector connection options
 */
export type ConnectionOptions = {
    /**
     * List of allowed chain ids. If nothing provided, all chain ids will be allowed
     */
    allowedChainIds?: number[] | null

    /**
     * Chain parameters or chain id to set a desired network.
     * Connector will initiate a network switch, if the user is connected to another chain id.
     * Handles request for adding the chain parameters if it is unknown to the provider.
     * If desiredChainOrChainId isn't set, no chain switch will be initiated.
     */
    desiredChainOrChainId?: number | AddEthereumChainParameter
    cache?: {
        /**
         * Indicates if a provider should be saved in the local storage.
         * @defaultValue true
         */
        enabled?: boolean

        /**
         * Key to access the provider in the local storage.
         * @defaultValue 'wallet-connector-provider'
         */
        key?: string
    }
}

/**
 * wallet-connector connection options including default options
 */
export type RequiredConnectionOptions = DeepRequired<ConnectionOptions>

export interface IConnectorInfo {
    /**
     * The connector id
     */
    id: string

    /**
     * The connector name
     */
    name: string

    /**
     * The connector logo svg
     */
    logo: string
}

/**
 * wallet-connector connector implementation
 */
export interface IConnector extends IConnectorInfo {
    /**
     * The connect-implementation of a connector
     * @returns {(Promise<IExternalProvider>)} The provider used for establishing a connection
     * @internal
     */
    connectImpl(): Promise<IExternalProvider>

    /**
     * The disconnect-implementation of a connector
     * @internal
     */
    disconnectImpl(): void
}
/**
 * This is the description of the interface
 *
 * @interface EditDialogField
 * @member {string} label is used for whatever reason
 * @field {string} prop is used for other reason
 */

/**
 * wallet-connector wrapper for a connector. Holds and manages a specific connector implementation.
 */
export interface IConnectorWrapper extends IConnectorInfo {
    /**
     * The provider
     */
    provider: IExternalProvider | undefined

    /**
     * All connected accounts
     */
    accounts: string[] | undefined

    /**
     * The connected chain id
     */
    chainId: number | undefined

    /**
     * The currently selected account
     */
    selectedAccount: string | undefined

    /**
     * Any errors that may have occurred
     */
    error: Error | undefined

    /**
     * Indicates if the current provider is in loading state
     * @defaultValue false
     */
    loading: boolean

    /**
     * Indicates if the current provider is connected
     * @defaultValue false
     */
    connected: boolean

    /**
     * Connects to the provider
     * @returns {(Promise<IConnectorWrapper>)} The responsible connector instance
     */
    connect: () => Promise<IConnectorWrapper>

    /**
     * Disconnects the provider
     */
    disconnect: () => void
}

export interface IConnectorFactory {
    /**
     * Object to reference all initialized connector by id
     */
    connectors: Record<string, IConnectorWrapper>

    /**
     * Object to reference all active connector by id
     */
    activeConnectors: Record<string, IConnectorWrapper>

    /**
     * The currently active connector
     */
    activeConnector: IConnectorWrapper | undefined

    /**
     * Adds a connector to active connectors
     * @internal
     */
    _add(wrapper: IConnectorWrapper): void

    /**
     * Removes a connector from active connectors
     * @internal
     */
    _remove(wrapper: IConnectorWrapper): void

    /**
     * Initializes a connector
     * @internal
     */
    _init(connectors: IConnector[], wrapper: IConnection): void
}

/**
 * wallet-connector connection. Initializes and manages connectors.
 * @public
 */
export interface IConnection extends IConnectorFactory {
    /**
     * Options passed to the connection instance by the user
     */
    options: RequiredConnectionOptions

    /**
     * The local connector storage
     * @internal
     */
    _storage: LocalStorage
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

    abstract connectImpl(): Promise<IExternalProvider>
    abstract disconnectImpl(): void
}
