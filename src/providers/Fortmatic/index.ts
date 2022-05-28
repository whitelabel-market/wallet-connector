import Fortmatic from 'fortmatic'
import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { ConnectResult, ProviderType } from '../../types'

export type FortmaticOptions = {
    key: string
    networkName?: string
}

export class FortmaticProvider extends AbstractExternalProvider<FortmaticOptions> {
    constructor(options: FortmaticOptions) {
        super('Fortmatic', Logo, ProviderType.WEB, options)
    }

    async _connect(): ConnectResult {
        const key = super.options.key
        const networkName = super.options.networkName
        const fm = new Fortmatic(key, networkName)
        const provider = await fm.getProvider()
        // provider.fm = fm;
        await fm.user.login()
        const isLoggedIn = await fm.user.isLoggedIn()
        if (isLoggedIn) {
            return provider
        } else {
            throw new Error('Failed to login to Fortmatic')
        }
    }
}

export default (options: FortmaticOptions) => new FortmaticProvider(options)
