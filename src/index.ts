import { initConnection, ChainIdNotAllowedError } from './core'
import Connectors from './connectors'
import {
    ConnectorStatus,
    type IConnector,
    type IConnectorWrapper,
    type ConnectionOptions,
    type ConnectResult,
} from './types'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink } = Connectors

export {
    initConnection,
    Connectors,
    ConnectorStatus,
    ChainIdNotAllowedError,
    Authereum,
    BinanceChain,
    Fortmatic,
    Frame,
    MetaMask,
    WalletConnect,
    WalletLink,
    IConnector,
    IConnectorWrapper,
    ConnectionOptions,
    ConnectResult,
}
