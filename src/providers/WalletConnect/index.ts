import WalletConnectProviderDefault from '@walletconnect/web3-provider'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { ProviderType } from '../../types'
import { IWalletConnectProviderOptions } from '@walletconnect/types'

export type WalletConnectOptions = IWalletConnectProviderOptions

export class WalletConnectProvider extends AbstractExternalProvider<WalletConnectOptions> {
    constructor(options: WalletConnectOptions) {
        super('WalletConnect', Logo, ProviderType.QRCODE, options)
    }

    async _connect(): Promise<WalletConnectProviderDefault> {
        const provider = new WalletConnectProviderDefault(super.options)
        await provider.enable()
        return provider
    }
}

export default (options: WalletConnectOptions) => new WalletConnectProvider(options)
