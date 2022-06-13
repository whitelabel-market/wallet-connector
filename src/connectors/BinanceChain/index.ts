import Logo from './logo.svg'
import { createConnector } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'

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
        this.provider = provider
        const [accounts, chainId] = await Promise.all([this._getEthAccounts(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        this.provider = undefined
    }
}

export default createConnector(new BinanceChainConnector())
