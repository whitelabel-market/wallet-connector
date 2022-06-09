import { Connection, ChainIdNotAllowedError } from './core'
import Connectors from './connectors'
import { type IConnection, type IConnector, type IConnectorWrapper, type ConnectionOptions } from './types'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink } = Connectors

export {
    Connection,
    ChainIdNotAllowedError,
    Connectors,
    Authereum,
    BinanceChain,
    Fortmatic,
    Frame,
    MetaMask,
    WalletConnect,
    WalletLink,
    IConnection,
    IConnector,
    IConnectorWrapper,
    ConnectionOptions,
}
