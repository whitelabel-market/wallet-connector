import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import type { IWalletConnectProviderOptions } from '@walletconnect/types'
import type WalletConnectProviderType from '@walletconnect/web3-provider'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract'

export type WalletConnectInitArgs = {
    options: IWalletConnectProviderOptions
    WalletConnectProvider: typeof WalletConnectProviderType
}

export class WalletConnectConnector extends AbstractConnector<WalletConnectInitArgs> {
    options!: WalletConnectInitArgs['options']
    WalletConnectProvider!: WalletConnectInitArgs['WalletConnectProvider']
    walletConnect!: WalletConnectProviderType

    constructor() {
        super('WalletConnect', Logo)
    }

    initImpl({ options, WalletConnectProvider }: WalletConnectInitArgs) {
        this.options = options
        // store the class as we need to reinstantiate walletConnect provider on every call to connectImpl()
        this.WalletConnectProvider = WalletConnectProvider
        return this
    }

    async connectImpl() {
        this.walletConnect = new this.WalletConnectProvider(this.options)
        await this.walletConnect.enable()
        return this.walletConnect as unknown as IExternalProvider
    }

    async disconnectImpl() {
        return await this.walletConnect.disconnect()
    }
}

export default createConnector<WalletConnectInitArgs>(new WalletConnectConnector())
