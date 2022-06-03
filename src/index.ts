import initConnection from './core'
import Connectors from './connectors'
import { ConnectorStatus, type IConnector, type ConnectionOptions, type ConnectResult } from './types'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink } = Connectors

export type { IConnector, ConnectionOptions, ConnectResult }
export {
    initConnection,
    Connectors,
    ConnectorStatus,
    Authereum,
    BinanceChain,
    Fortmatic,
    Frame,
    MetaMask,
    WalletConnect,
    WalletLink,
}
