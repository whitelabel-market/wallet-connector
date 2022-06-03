import WalletConnectProviderDefault from '@walletconnect/web3-provider'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider, ConnectorType } from '../../types'
import { IWalletConnectProviderOptions } from '@walletconnect/types'
import { createConnector } from '../../core/connector/construction'

export type WalletConnectOptions = IWalletConnectProviderOptions

export class WalletConnectConnector extends AbstractConnector<WalletConnectOptions> {
    walletConnect!: WalletConnectProviderDefault

    constructor() {
        super('WalletConnect', Logo, ConnectorType.QRCODE)
    }

    async connectImpl() {
        this.walletConnect = new WalletConnectProviderDefault(this.options)
        await this.walletConnect.enable()
        return this.walletConnect as unknown as IExternalProvider
    }

    disconnectImpl() {
        return this.walletConnect.disconnect()
    }
}

export default createConnector(new WalletConnectConnector())
