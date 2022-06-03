import { Authereum } from 'authereum/dist'
import Logo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { createProvider } from '../../core/provider/construction'

export type AuthereumOptions = {
    apiKey: string
    networkName?: string
    rpcUri?: string
    webUri?: string
    xsUri?: string
    blockedPopupRedirect?: boolean
    forceRedirect?: boolean
    disableNotifications?: boolean
    disableGoogleAnalytics?: boolean
}

class AuthereumProvider extends AbstractProvider<AuthereumOptions> {
    constructor() {
        super('Authereum', Logo, ProviderType.WEB)
    }

    async connectImpl() {
        const authereum = new Authereum(this.options)
        const provider = authereum.getProvider()
        provider.authereum = authereum
        await provider.enable()
        return provider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createProvider<AuthereumOptions>(new AuthereumProvider())
