import Logo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { ConnectResult, ProviderType } from '../../types'

export class BinanceChainProvider extends AbstractExternalProvider {
    constructor() {
        super('Binance Chain', Logo, ProviderType.INJECTED)
    }

    async _connect(): ConnectResult {
        let provider = null
        if (typeof (window as any).BinanceChain !== 'undefined') {
            provider = (window as any).BinanceChain
            try {
                await provider.request({ method: 'eth_requestAccounts' })
            } catch (error) {
                throw new Error('User Rejected')
            }
        } else {
            throw new TypeError('No Binance Chain Wallet found')
        }
        return provider
    }
}

export default () => new BinanceChainProvider()
