import { CoinbaseWalletSDK, CoinbaseWalletProvider } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { ProviderType } from '../../types'

export type WalletLinkOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string
    chainId: number
}

export class WalletLinkProvider extends AbstractExternalProvider<WalletLinkOptions> {
    constructor(options: WalletLinkOptions) {
        super('Coinbase Wallet', Logo, ProviderType.QRCODE, options)
    }

    async _connect(): Promise<CoinbaseWalletProvider> {
        const walletLink = new CoinbaseWalletSDK(super.options)
        const provider = walletLink.makeWeb3Provider(super.options.rpcUrl, super.options.chainId)
        await provider.send('eth_requestAccounts')
        return provider
    }
}

export default (options: WalletLinkOptions) => new WalletLinkProvider(options)
