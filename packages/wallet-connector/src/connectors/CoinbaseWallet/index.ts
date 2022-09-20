import type { CoinbaseWalletSDK as CoinbaseWalletSDKType } from '@coinbase/wallet-sdk'
import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'

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

    constructor() {
        super('Coinbase Wallet', Logo)
    }

    initImpl({ options, CoinbaseWalletSDK }: CoinbaseWalletInitArgs) {
        this.options = options
        this.sdk = new CoinbaseWalletSDK(this.options)
        this.provider = this.sdk.makeWeb3Provider(this.options.rpcUrl) as unknown as IExternalProvider
        return this
    }

    async connectImpl() {
        const [accounts, chainId] = await Promise.all([this._ethRequestAccounts(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        await this.sdk.disconnect()
    }
}

export default createConnector<CoinbaseWalletInitArgs>(new CoinbaseWalletConnector())
