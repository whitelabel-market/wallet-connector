import Core from './core'
import Providers from './providers'
import type { IProvider, ConnectorOptions, ProviderType, ConnectResult } from './types'

const { Connector } = Core

export type { IProvider, ProviderType, ConnectorOptions, ConnectResult }
export { Connector, Providers }
