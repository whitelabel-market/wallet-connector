import { AddEthereumChainParameter, IExternalProvider, SwitchEthereumChainParameter } from '../../types'

export abstract class AbstractExternalProvider {
    provider!: IExternalProvider | undefined

    _ethRequestAccounts() {
        return this.provider?.request({ method: 'eth_requestAccounts' }) as Promise<string[]>
    }

    _getEthAccounts() {
        return this.provider?.request({ method: 'eth_accounts' }) as Promise<string[]>
    }

    _getEthChainId() {
        return this.provider?.request({ method: 'eth_chainId' }) as Promise<string>
    }

    _switchEthChain(params: SwitchEthereumChainParameter) {
        return this.provider?.request({
            method: 'wallet_switchEthereumChain',
            params: [params],
        })
    }

    _addEthChain(params: AddEthereumChainParameter) {
        return this.provider?.request({
            method: 'wallet_addEthereumChain',
            params: [params],
        })
    }
}
