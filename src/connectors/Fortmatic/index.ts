import Logo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import type FortmaticType from 'fortmatic'

import { AbstractConnector } from '../../core/connectorImpl/abstract'

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
        const provider = await this.fm.getProvider()
        // provider.fm = fm;
        await this.fm.user.login()
        const isLoggedIn = await this.fm.user.isLoggedIn()
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

export default createConnector<FortmaticInitArgs>(new FortmaticConnector())
