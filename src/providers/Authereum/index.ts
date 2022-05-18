import { Authereum } from 'authereum/dist'
import { ProviderType, ConnectorOptions } from '../../types'
import Logo from './logo.svg'
import { ExternalProvider } from '../../core/ExternalProvider'

function onConnect(options: ConnectorOptions) {
    const authereum = new Authereum({
        apiKey: options.authereum.key,
        networkName: options.networkName,
        rpcUri: options.rpcUri,
        webUri: options.webUri,
        xsUri: options.webUri,
        blockedPopupRedirect: options.authereum.blockedPopupRedirect,
        forceRedirect: options.authereum.forceRedirect,
        disableNotifications: options.authereum.disableNotifications,
        disableGoogleAnalytics: options.authereum.disableGoogleAnalytics,
    })
    const provider = authereum.getProvider()
    provider.authereum = authereum
    return provider.enable()
}

export default new ExternalProvider('Authereum', Logo, ProviderType.WEB, onConnect)
