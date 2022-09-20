import Logo from './logo.svg'
import { createConnector } from '../../helpers/construction'
import type FortmaticType from 'fortmatic'

import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'

export type FortmaticInitArgs = {
    options: {
        key: string
        networkName?: string
    }
    Fortmatic: typeof FortmaticType
}

export class FortmaticConnector extends AbstractConnector<FortmaticInitArgs> {
    options!: FortmaticInitArgs['options']
    fm!: any

    constructor() {
        super('Fortmatic', Logo)
    }

    initImpl({ options, Fortmatic }: FortmaticInitArgs) {
        this.options = options
        this.fm = new Fortmatic(this.options.key, this.options.networkName)
        return this
    }

    async connectImpl() {
        this.provider = await this.fm.getProvider()
        // provider.fm = fm;
        await this.fm.user.login()
        const isLoggedIn = await this.fm.user.isLoggedIn()
        if (isLoggedIn) {
            const [accounts, chainId] = await Promise.all([this._getEthAccounts(), this._getEthChainId()])
            return { accounts, chainId }
        } else {
            throw new Error('Failed to login to Fortmatic')
        }
    }

    async disconnectImpl() {
        await this.fm.user.logout()
        this.provider = undefined
    }
}

export default createConnector<FortmaticInitArgs>(new FortmaticConnector())
