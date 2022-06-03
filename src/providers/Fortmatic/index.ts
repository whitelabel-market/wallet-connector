import Fortmatic from 'fortmatic'
import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider, ConnectorType } from '../../types'
import { createConnector } from '../../core/construction'
import { BinanceChainConnector } from '../BinanceChain'

export type FortmaticOptions = {
    key: string
    networkName?: string
}

export class FortmaticConnector extends AbstractConnector<FortmaticOptions> {
    constructor() {
        super('Fortmatic', Logo, ConnectorType.WEB)
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

export default createConnector(new BinanceChainConnector())
