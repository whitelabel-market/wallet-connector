import WalletConnectProviderDefault from '@walletconnect/web3-provider'
import Logo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { IWalletConnectProviderOptions } from '@walletconnect/types'
import { createProvider } from '../../core/provider/construction'

export type WalletConnectOptions = IWalletConnectProviderOptions

export class WalletConnectProvider extends AbstractProvider<WalletConnectOptions> {
    walletConnect!: WalletConnectProviderDefault

    constructor() {
        super('WalletConnect', Logo, ProviderType.QRCODE)
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

export default createProvider(new WalletConnectProvider())
