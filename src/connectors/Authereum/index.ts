import { Authereum } from 'authereum/dist'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../core/construction'

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

class AuthereumConnector extends AbstractConnector<AuthereumOptions> {
    constructor() {
        super('Authereum', Logo)
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

export default createConnector<AuthereumOptions>(new AuthereumConnector())
