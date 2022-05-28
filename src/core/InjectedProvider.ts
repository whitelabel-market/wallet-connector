import { AbstractProviderBase } from './BaseProvider'
import { ProviderType } from '../types'

export abstract class AbstractInjectedProvider extends AbstractProviderBase<Record<string, unknown>> {
    protected constructor(name: string, logo: string) {
        super(name, logo, ProviderType.INJECTED, {})
    }

    async _connect() {
        let provider = null
        if (typeof window.ethereum !== 'undefined') {
            provider = window.ethereum
            try {
                await provider.request({ method: 'eth_requestAccounts' })
            } catch (error) {
                throw new Error('User Rejected')
            }
        } else if ((window as any)?.web3) {
            provider = (window as any).web3.currentProvider
        } else if ((window as any)?.celo) {
            provider = (window as any).celo
        } else {
            throw new Error('No Web3 Provider found')
        }

        if (provider?.providers?.length) {
            if (this.name.toLowerCase() === 'metamask')
                provider = provider.providers.find((provider: any) => provider.isMetaMask)
        }

        return provider
    }
}
