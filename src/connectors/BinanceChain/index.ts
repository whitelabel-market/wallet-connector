import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../core/construction'

export class BinanceChainConnector extends AbstractConnector {
    constructor() {
        super('Binance Chain', Logo)
    }

    async connectImpl() {
        // ToDo: Conform to existing Injected Connector implementation
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

export default createConnector(new BinanceChainConnector())
