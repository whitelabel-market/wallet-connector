import type { CoinbaseWalletSDK as CoinbaseWalletSDKType } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract'
import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk'

export type CoinbaseWalletInitArgs = {
    options: ConstructorParameters<typeof CoinbaseWalletSDKType>[0] & {
        rpcUrl: string
        chainId: number
    }
    CoinbaseWalletSDK: typeof CoinbaseWalletSDKType
}

export class CoinbaseWalletConnector extends AbstractConnector<CoinbaseWalletInitArgs> {
    options!: CoinbaseWalletInitArgs['options']
    sdk!: CoinbaseWalletSDKType
    coinbaseWalletProvider!: CoinbaseWalletProvider

    constructor() {
        super('Coinbase Wallet', Logo)
    }

    initImpl({ options, CoinbaseWalletSDK }: CoinbaseWalletInitArgs) {
        this.options = options
        this.sdk = new CoinbaseWalletSDK(this.options)
        this.coinbaseWalletProvider = this.sdk.makeWeb3Provider(this.options.rpcUrl)
        return this
    }

    async connectImpl() {
        await this.coinbaseWalletProvider?.request({ method: 'eth_requestAccounts' })
        return this.coinbaseWalletProvider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        return this.sdk.disconnect()
    }
}

export default createConnector<CoinbaseWalletInitArgs>(new CoinbaseWalletConnector())
