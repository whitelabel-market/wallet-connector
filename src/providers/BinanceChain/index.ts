import Logo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { createProvider } from '../../core/provider/construction'

export class BinanceChainProvider extends AbstractProvider {
    constructor() {
        super('Binance Chain', Logo, ProviderType.INJECTED)
    }

    async connectImpl() {
        // ToDo: Conform to existing Injected Provider implementation
        let provider = null
        if (typeof (window as any).BinanceChain !== 'undefined') {
            provider = (window as any).BinanceChain
        } else {
            throw new TypeError('No Binance Chain Wallet found')
        }
        return provider as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createProvider(new BinanceChainProvider())
