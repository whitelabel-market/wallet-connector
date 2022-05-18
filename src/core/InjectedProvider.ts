import { ProviderType } from '@wallet-connector/types'
import { BaseProvider } from '@wallet-connector/core/BaseProvider'

export class InjectedProvider extends BaseProvider {
    constructor(name: string, logo: string) {
        super(name, logo, ProviderType.INJECTED)
    }

    protected async onConnect() {
        let provider = null
        if (typeof window.ethereum !== 'undefined') {
            provider = (window as any).ethereum
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
