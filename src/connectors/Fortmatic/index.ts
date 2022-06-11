import Logo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'

export type FortmaticOptions = {
    key: string
    networkName?: string
}

export class FortmaticConnector extends AbstractConnector<FortmaticOptions> {
    constructor() {
        super('Fortmatic', Logo)
    }

    async connectImpl() {
        const { default: Fortmatic } = await import('fortmatic')
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

export default createConnector(new FortmaticConnector())
