import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { Ethereumish, ProviderType } from '../../types'

export type WalletLinkOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string
    chainId: number
}

export class WalletLinkProvider extends AbstractExternalProvider<WalletLinkOptions> {
    constructor(options: WalletLinkOptions) {
        super('Coinbase Wallet', Logo, ProviderType.QRCODE, options)
    }

    async _connect() {
        const walletLink = new CoinbaseWalletSDK(super.options)
        const provider = walletLink.makeWeb3Provider(super.options.rpcUrl, super.options.chainId)
        return provider as unknown as Ethereumish
    }
}

export default (options: WalletLinkOptions) => new WalletLinkProvider(options)
