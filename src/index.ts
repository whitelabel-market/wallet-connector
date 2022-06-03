import initConnection from './core'
import Connectors from './providers'
import type { IConnector, ConnectionOptions, ConnectorType, ConnectorStatus, ConnectResult } from './types'

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink } = Connectors

export type { IConnector, ConnectorType, ConnectorStatus, ConnectionOptions, ConnectResult }
export { initConnection, Connectors, Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, WalletLink }
