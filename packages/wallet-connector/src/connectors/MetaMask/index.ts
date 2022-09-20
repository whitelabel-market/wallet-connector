import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector, createInjectedProvider } from '../../helpers/construction'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'
import type detectProviderType from '@metamask/detect-provider'

export type MetaMaskInitArgs = {
    options?: Parameters<typeof detectProviderType>[0]
    detectProvider: typeof detectProviderType
}

export class MetaMaskConnector extends AbstractConnector<MetaMaskInitArgs> {
    static DEEP_LINK_BASE = 'https://metamask.app.link/dapp/'

    options!: MetaMaskInitArgs['options']
    detectProvider!: MetaMaskInitArgs['detectProvider']

    constructor() {
        super('MetaMask', Logo)
    }

    initImpl({ options, detectProvider }: MetaMaskInitArgs) {
        this.options = options
        this.detectProvider = detectProvider
        return this
    }

    async connectImpl() {
        const provider = (await this.detectProvider(this.options)) as unknown as IExternalProvider
        if (!provider) {
            MetaMaskConnector._redirect()
            throw new Error('No Metamask provider found')
        }
        // handle edge case when multiple injected providers are installed
        this.provider = createInjectedProvider(provider, 'isMetaMask')
        const [accounts, chainId] = await Promise.all([this._ethRequestAccounts(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        this.provider = undefined
    }

    private static _redirect() {
        const target = '_blank'
        const { host, pathname } = window.location
        window.open(`${MetaMaskConnector.DEEP_LINK_BASE}${host + pathname}`, target)
    }
}

export default createConnector<MetaMaskInitArgs>(new MetaMaskConnector())
