import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import type AuthereumType from 'authereum/dist'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'

export type AuthereumOptions = {
    apiKey: string
    networkName?: string
    rpcUri?: string
    webUri?: string
    xsUri?: string
    blockedPopupRedirect?: boolean
    forceRedirect?: boolean
    disableNotifications?: boolean
    disableGoogleAnalytics?: boolean
}

export type AuthereumInitArgs = {
    options: AuthereumOptions
    Authereum: typeof AuthereumType
}

class AuthereumConnector extends AbstractConnector<AuthereumInitArgs> {
    options!: AuthereumInitArgs['options']
    authereum!: AuthereumType

    constructor() {
        super('Authereum', Logo)
    }

    initImpl({ options, Authereum }: AuthereumInitArgs) {
        this.options = options
        this.authereum = new Authereum(this.options)
        return this
    }

    async connectImpl() {
        const provider = this.authereum.getProvider()
        provider.authereum = this.authereum
        this.provider = provider as unknown as IExternalProvider
        const [accounts, chainId] = await Promise.all([provider.enable(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        await this.authereum.logout()
        this.provider = undefined
    }
}

export default createConnector<AuthereumInitArgs>(new AuthereumConnector())
