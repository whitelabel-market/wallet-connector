// @ts-ignore
import type { CoinbaseWalletSDK as CoinbaseWalletSDKType } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'

export type CoinbaseWalletOptions = ConstructorParameters<typeof CoinbaseWalletSDKType>[0] & {
    rpcUrl: string
    chainId: number
}

export class CoinbaseWalletConnector extends AbstractConnector<CoinbaseWalletOptions> {
    coinbaseWallet!: CoinbaseWalletSDKType

    constructor() {
        super('Coinbase Wallet', Logo)
    }

    async connectImpl() {
        const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk')
        this.coinbaseWallet = new CoinbaseWalletSDK(this.options)
        const provider = await this.coinbaseWallet.makeWeb3Provider(this.options.rpcUrl)
        return provider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        return this.coinbaseWallet.disconnect()
    }
}

export default createConnector(new CoinbaseWalletConnector())
