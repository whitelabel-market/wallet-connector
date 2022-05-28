import WalletConnectProviderDefault from '@walletconnect/web3-provider'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { Ethereumish, ProviderType } from '../../types'
import { IWalletConnectProviderOptions } from '@walletconnect/types'

export type WalletConnectOptions = IWalletConnectProviderOptions

export class WalletConnectProvider extends AbstractExternalProvider<WalletConnectOptions> {
    constructor(options: WalletConnectOptions) {
        super('WalletConnect', Logo, ProviderType.QRCODE, options)
    }

    async _connect() {
        const provider = new WalletConnectProviderDefault(super.options)
        await provider.enable()
        return provider as unknown as Ethereumish
    }
}

export default (options: WalletConnectOptions) => new WalletConnectProvider(options)
