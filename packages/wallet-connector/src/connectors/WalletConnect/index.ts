import Logo from './logo.svg'
import type { IWalletConnectProviderOptions } from '@walletconnect/types'
import type WalletConnectProviderType from '@walletconnect/web3-provider'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'
import { IExternalProvider } from '../../types'

export type WalletConnectInitArgs = {
    options: IWalletConnectProviderOptions
    WalletConnectProvider: typeof WalletConnectProviderType
}

export class WalletConnectConnector extends AbstractConnector<WalletConnectInitArgs> {
    options!: WalletConnectInitArgs['options']
    WalletConnectProvider!: WalletConnectInitArgs['WalletConnectProvider']

    constructor() {
        super('WalletConnect', Logo)
    }

    initImpl({ options, WalletConnectProvider }: WalletConnectInitArgs) {
        this.options = options
        this.WalletConnectProvider = WalletConnectProvider
        return this
    }

    async connectImpl() {
        const walletConnectProvider = new this.WalletConnectProvider(this.options)
        this.provider = walletConnectProvider as unknown as IExternalProvider
        const [accounts, chainId] = await Promise.all([walletConnectProvider.enable(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        const walletConnectProvider = this.provider as unknown as WalletConnectProviderType
        await walletConnectProvider.disconnect()
        this.provider = undefined
    }
}

export default createConnector<WalletConnectInitArgs>(new WalletConnectConnector())
