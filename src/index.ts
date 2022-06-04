import initConnection from './core'
import Connectors from './connectors'
import { ConnectorStatus, type IConnector, type ConnectionOptions, type ConnectResult } from './types'
import { ChainIdNotAllowedError } from './helpers/chainId'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink } = Connectors

export type { IConnector, ConnectionOptions, ConnectResult }
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
}
