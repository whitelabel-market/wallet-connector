import { Authereum } from 'authereum/dist'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { Ethereumish, ProviderType } from '../../types'

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

export class AuthereumProvider extends AbstractExternalProvider<AuthereumOptions> {
    constructor(options: AuthereumOptions) {
        super('Authereum', Logo, ProviderType.WEB, options)
    }

    protected async _connect() {
        const authereum = new Authereum(super.options)
        const provider = authereum.getProvider()
        provider.authereum = authereum
        await provider.enable()
        return provider as unknown as Ethereumish
    }
}

export default (options: AuthereumOptions) => new AuthereumProvider(options)
