import { ConnectFn, ProviderType } from '@wallet-connector/types'
import { BaseProvider } from '@wallet-connector/core/BaseProvider'

export class ExternalProvider extends BaseProvider {
    protected onConnect!: ConnectFn

    constructor(name: string, logo: string, type: ProviderType, onConnect: ConnectFn) {
        super(name, logo, type)
        this.onConnect = onConnect
    }
}
