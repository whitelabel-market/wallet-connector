import Fortmatic from 'fortmatic'
import Logo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { createProvider } from '../../core/provider/construction'
import { BinanceChainProvider } from '../BinanceChain'

export type FortmaticOptions = {
    key: string
    networkName?: string
}

export class FortmaticProvider extends AbstractProvider<FortmaticOptions> {
    constructor() {
        super('Fortmatic', Logo, ProviderType.WEB)
    }

    async connectImpl() {
        const fm = new Fortmatic(this.options.key, this.options.networkName)
        const provider = await fm.getProvider()
        // provider.fm = fm;
        await fm.user.login()
        const isLoggedIn = await fm.user.isLoggedIn()
        if (isLoggedIn) {
            return provider as unknown as IExternalProvider
        } else {
            throw new Error('Failed to login to Fortmatic')
        }
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createProvider(new BinanceChainProvider())
