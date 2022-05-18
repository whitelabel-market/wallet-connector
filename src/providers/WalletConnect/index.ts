import WalletConnectProvider from '@walletconnect/web3-provider'
import { ProviderType, ConnectorOptions } from '../../types'
import Logo from './logo.svg'
import { ExternalProvider } from '../../core/ExternalProvider'

function onConnect(options: ConnectorOptions) {
    const provider = new WalletConnectProvider({
        bridge: options.walletconnect?.bridge,
        qrcode: options.walletconnect?.qrcode,
        infuraId: options.infuraId,
        rpc: options.rpcUri,
        chainId: options.chainId,
        qrcodeModalOptions: options.walletconnect?.qrcodeModalOptions,
    })

    return provider.enable()
}

export default new ExternalProvider('WalletConnect', Logo, ProviderType.QRCODE, onConnect)
