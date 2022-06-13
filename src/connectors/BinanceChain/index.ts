import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract'

export class BinanceChainConnector extends AbstractConnector {
    constructor() {
        super('Binance Chain', Logo)
    }

    initImpl() {
        return this
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
