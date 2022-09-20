import { Connection, ChainIdNotAllowedError, ChainIdNotDesiredError } from './core'
import Connectors from './connectors'
import { type IConnection, type IConnector, type IConnectorWrapper, type ConnectionOptions } from './types'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, CoinbaseWallet } = Connectors

export {
    Connection,
    ChainIdNotAllowedError,
    ChainIdNotDesiredError,
    Connectors,
    Authereum,
    BinanceChain,
    Fortmatic,
    Frame,
    MetaMask,
    WalletConnect,
    CoinbaseWallet,
    IConnection,
    IConnector,
    IConnectorWrapper,
    ConnectionOptions,
}
