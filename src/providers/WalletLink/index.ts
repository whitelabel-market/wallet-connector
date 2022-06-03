import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider, ConnectorType } from '../../types'
import { createConnector } from '../../core/connector/construction'

export type WalletLinkOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string
    chainId: number
}

export class WalletLinkConnector extends AbstractConnector<WalletLinkOptions> {
    coinbaseWallet!: CoinbaseWalletSDK

    constructor() {
        super('Coinbase Wallet', Logo, ConnectorType.QRCODE)
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

export default createConnector(new WalletLinkConnector())
