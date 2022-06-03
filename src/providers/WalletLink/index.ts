import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { createProvider } from '../../core/provider/construction'

export type WalletLinkOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string
    chainId: number
}

export class WalletLinkProvider extends AbstractProvider<WalletLinkOptions> {
    coinbaseWallet!: CoinbaseWalletSDK

    constructor() {
        super('Coinbase Wallet', Logo, ProviderType.QRCODE)
    }

    async connectImpl() {
        this.coinbaseWallet = new CoinbaseWalletSDK(this.options)
        const provider = await this.coinbaseWallet.makeWeb3Provider(this.options.rpcUrl)
        return provider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        return this.coinbaseWallet.disconnect()
    }
}

export default createProvider(new WalletLinkProvider())
