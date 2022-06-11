import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
// @ts-ignore
import type { IWalletConnectProviderOptions } from '@walletconnect/types'
// @ts-ignore
import type WalletConnectProvider from '@walletconnect/web3-provider'

import { createConnector, peerImport } from '../../helpers/construction'

export type WalletConnectOptions = IWalletConnectProviderOptions

export class WalletConnectConnector extends AbstractConnector<WalletConnectOptions> {
    walletConnect!: WalletConnectProvider

    constructor() {
        super('WalletConnect', Logo)
    }

    async connectImpl() {
        const WalletConnectWeb3Provider = await peerImport('@walletconnect/web3-provider')
        this.walletConnect = new WalletConnectWeb3Provider(this.options)
        await this.walletConnect.enable()
        return this.walletConnect as unknown as IExternalProvider
    }

    disconnectImpl() {
        return this.walletConnect.disconnect()
    }
}

export default createConnector(new WalletConnectConnector())
