import Logo from './logo.svg'
import { AbstractConnector } from '../../types'
import { createConnector } from '../../core/construction'

export class MetaMaskConnector extends AbstractConnector {
    constructor() {
        super('MetaMask', Logo)
    }

    async connectImpl() {
        let provider = null
        if (typeof window.ethereum !== 'undefined') {
            provider = (window as any).ethereum
            // if (this.id === 'metamask') provider = provider.providers.find((provider: any) => provider.isMetaMask)
            // if (this.id === 'coinbasewallet')
            //     provider = provider.providers.find((provider: any) => provider.isCoinbaseWallet)
        } else if ((window as any)?.web3) {
            provider = (window as any).web3.currentProvider
        } else {
            const metaMaskDeeplink = 'https://metamask.app.link/dapp/'
            const { host, pathname } = window.location
            const url = `${metaMaskDeeplink}${host + pathname}`
            window.open(url, '_blank')

            throw new Error('No Web3 Provider found')
        }
        await provider?.request({ method: 'eth_requestAccounts' })
        return provider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createConnector(new MetaMaskConnector())
