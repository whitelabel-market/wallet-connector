import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import * as _walletconnect_types from '@walletconnect/types';
import EventEmitter from 'eventemitter3';

declare class LocalStorage {
    key: string;
    storage?: WindowLocalStorage['localStorage'];
    enabled: boolean;
    constructor(key: string);
    set(data: any): void;
    get(): any;
    remove(): void;
    update(data: any): void;
}

declare type DeepRequired<T> = {
    [K in keyof T]: DeepRequired<T[K]>;
} & Required<T>;
interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}
interface ProviderConnectInfo {
    readonly chainId: string;
}
interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
interface AddEthereumChainParameter {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
}
interface ProviderMessage {
    readonly type: string;
    readonly data: unknown;
}
interface EthereumEvent {
    connect: ProviderConnectInfo;
    disconnect: ProviderRpcError;
    accountsChanged: string[];
    chainChanged: string;
    message: ProviderMessage;
    block: string;
}
declare type EventKeys = keyof EthereumEvent;
declare type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void;
interface IExternalProvider {
    chainId: string;
    isMetaMask?: boolean;
    isStatus?: boolean;
    networkVersion: string;
    selectedAddress: string;
    connected?: boolean;
    providers?: IExternalProvider[];
    on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void;
    enable(): Promise<string[]>;
    request(args: RequestArguments): Promise<unknown>;
    removeAllListeners: () => void;
    /**
     * @deprecated
     */
    send?: (...args: unknown[]) => unknown;
    sendAsync?: (request: {
        method: string;
        params?: Array<any>;
    }, callback: (error: any, response: any) => void) => void;
}
/**
 * wallet-connector connection options
 */
declare type ConnectionOptions = {
    /**
     * List of allowed chain ids. If nothing provided, all chain ids will be allowed
     */
    allowedChainIds?: number[] | null;
    /**
     * Chain parameters or chain id to set a desired network.
     * Connector will initiate a network switch, if the user is connected to another chain id.
     * Handles request for adding the chain parameters if it is unknown to the provider.
     * If desiredChainOrChainId isn't set, no chain switch will be initiated.
     */
    desiredChainOrChainId?: number | AddEthereumChainParameter | null;
    cache?: {
        /**
         * Indicates if a provider should be saved in the local storage.
         * @defaultValue true
         */
        enabled?: boolean;
        /**
         * Key to access the provider in the local storage.
         * @defaultValue 'wallet-connector-provider'
         */
        key?: string;
    };
};
/**
 * wallet-connector connection options including default options
 */
declare type RequiredConnectionOptions = DeepRequired<ConnectionOptions>;
interface IConnectorInfo {
    /**
     * The connector id
     */
    id: string;
    /**
     * The connector name
     */
    name: string;
    /**
     * The connector logo svg
     */
    logo: string;
}
/**
 * wallet-connector connector implementation
 */
interface IConnector extends IConnectorInfo {
    /**
     * The connect-implementation of a connector
     * @returns {(Promise<IExternalProvider>)} The provider used for establishing a connection
     * @internal
     */
    connectImpl(): Promise<IExternalProvider>;
    /**
     * The disconnect-implementation of a connector
     * @internal
     */
    disconnectImpl(): void;
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
interface IConnectorWrapper extends IConnectorInfo {
    /**
     * The provider
     */
    provider: IExternalProvider | undefined;
    /**
     * All connected accounts
     */
    accounts: string[] | undefined;
    /**
     * The connected chain id
     */
    chainId: number | undefined;
    /**
     * The currently selected account
     */
    selectedAccount: string | undefined;
    /**
     * Any errors that may have occurred
     */
    error: Error | undefined;
    /**
     * Indicates if the current provider is in loading state
     * @defaultValue false
     */
    loading: boolean;
    /**
     * Indicates if the current provider is connected
     * @defaultValue false
     */
    connected: boolean;
    /**
     * Connects to the provider
     * @returns {(Promise<IConnectorWrapper>)} The responsible connector instance
     */
    connect: () => Promise<IConnectorWrapper>;
    /**
     * Disconnects the provider
     */
    disconnect: () => void;
}
interface IConnectorFactory {
    /**
     * Object to reference all initialized connector by id
     */
    connectors: Record<string, IConnectorWrapper>;
    /**
     * Object to reference all active connector by id
     */
    activeConnectors: Record<string, IConnectorWrapper>;
    /**
     * The currently active connector
     */
    activeConnector: IConnectorWrapper | undefined;
    /**
     * Adds a connector to active connectors
     * @internal
     */
    _add(wrapper: IConnectorWrapper): void;
    /**
     * Removes a connector from active connectors
     * @internal
     */
    _remove(wrapper: IConnectorWrapper): void;
    /**
     * Initializes a connector
     * @internal
     */
    _init(connectors: IConnector[], wrapper: IConnection): void;
}
/**
 * wallet-connector connection. Initializes and manages connectors.
 * @public
 */
interface IConnection extends IConnectorFactory {
    /**
     * Options passed to the connection instance by the user
     */
    options: RequiredConnectionOptions;
    /**
     * The local connector storage
     * @internal
     */
    _storage: LocalStorage;
}

declare type CoinbaseWalletOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string;
    chainId: number;
};

declare type FortmaticOptions = {
    key: string;
    networkName?: string;
};

declare type AuthereumOptions = {
    apiKey: string;
    networkName?: string;
    rpcUri?: string;
    webUri?: string;
    xsUri?: string;
    blockedPopupRedirect?: boolean;
    forceRedirect?: boolean;
    disableNotifications?: boolean;
    disableGoogleAnalytics?: boolean;
};

declare class ChainIdNotAllowedError extends Error {
    readonly chainId: number;
    constructor(chainId: number, allowedChainIds: number[]);
}
declare class ChainIdNotDesiredError extends Error {
    readonly chainId: number;
    constructor(chainId: number, desiredChainId: number);
}

declare class ConnectorFactory extends EventEmitter implements IConnectorFactory {
    connectors: Record<string, IConnectorWrapper>;
    activeConnectors: Record<string, IConnectorWrapper>;
    activeConnector: IConnectorWrapper | undefined;
    constructor();
    _init(connectors: IConnector[], connection: IConnection): void;
    _add(connector: IConnectorWrapper): void;
    _remove(connector: IConnectorWrapper): void;
}

declare class Connection extends ConnectorFactory implements IConnection {
    options: RequiredConnectionOptions;
    _storage: LocalStorage;
    constructor(options: ConnectionOptions, connectors: IConnector[]);
    loadFromCache(): Promise<IConnectorWrapper> | undefined;
}

declare const _default: {
    Authereum: (options?: AuthereumOptions | undefined) => IConnector;
    BinanceChain: (options?: void | undefined) => IConnector;
    Fortmatic: (options?: FortmaticOptions | undefined) => IConnector;
    Frame: (options?: void | undefined) => IConnector;
    MetaMask: (options?: void | undefined) => IConnector;
    WalletConnect: (options?: _walletconnect_types.IWalletConnectProviderOptions | undefined) => IConnector;
    CoinbaseWallet: (options?: CoinbaseWalletOptions | undefined) => IConnector;
};

declare const Authereum: (options?: AuthereumOptions | undefined) => IConnector;
declare const BinanceChain: (options?: void | undefined) => IConnector;
declare const Fortmatic: (options?: FortmaticOptions | undefined) => IConnector;
declare const Frame: (options?: void | undefined) => IConnector;
declare const MetaMask: (options?: void | undefined) => IConnector;
declare const WalletConnect: (options?: _walletconnect_types.IWalletConnectProviderOptions | undefined) => IConnector;
declare const CoinbaseWallet: (options?: CoinbaseWalletOptions | undefined) => IConnector;

export { Authereum, BinanceChain, ChainIdNotAllowedError, ChainIdNotDesiredError, CoinbaseWallet, Connection, ConnectionOptions, _default as Connectors, Fortmatic, Frame, IConnection, IConnector, IConnectorWrapper, MetaMask, WalletConnect };
