import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import detectEthereumProvider from '@metamask/detect-provider'

export class MetaMaskConnector extends AbstractConnector {
    static DEEP_LINK_BASE = 'https://metamask.app.link/dapp/'

    constructor() {
        super('MetaMask', Logo)
    }

    async connectImpl() {
        const provider = (await detectEthereumProvider()) as IExternalProvider
        if (!provider) {
            MetaMaskConnector._redirect()
            throw new Error('No Metamask provider found')
        }
        // eth_requestAccounts already done in connector wrapper
        // await provider.request({ method: 'eth_requestAccounts' })
        return provider
    }

    async disconnectImpl() {
        return null
    }

    private static _redirect() {
        const target = '_blank'
        const { host, pathname } = window.location
        window.open(`${MetaMaskConnector.DEEP_LINK_BASE}${host + pathname}`, target)
    }
}

export default createConnector(new MetaMaskConnector())
