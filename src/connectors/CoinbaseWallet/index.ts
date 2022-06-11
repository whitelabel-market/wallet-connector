// @ts-ignore
import type { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector, peerImport } from '../../helpers/construction'

export type CoinbaseWalletOptions = ConstructorParameters<typeof CoinbaseWalletSDK>[0] & {
    rpcUrl: string
    chainId: number
}

export class CoinbaseWalletConnector extends AbstractConnector<CoinbaseWalletOptions> {
    coinbaseWallet!: CoinbaseWalletSDK

    constructor() {
        super('Coinbase Wallet', Logo)
    }

    async connectImpl() {
        const CoinbaseWallet = await peerImport('@coinbase/wallet-sdk', 'CoinbaseWalletSDK')
        this.coinbaseWallet = new CoinbaseWallet(this.options)
        const provider = await this.coinbaseWallet.makeWeb3Provider(this.options.rpcUrl)
        return provider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        return this.coinbaseWallet.disconnect()
    }
}

export default createConnector(new CoinbaseWalletConnector())
