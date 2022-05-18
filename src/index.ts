import Core from './core'
import Providers from './providers'
import type { IProvider, ConnectorUserOptions, ProviderType } from './types'

const { Connector } = Core

export type { IProvider, ConnectorUserOptions, ProviderType }
export { Connector, Providers }
