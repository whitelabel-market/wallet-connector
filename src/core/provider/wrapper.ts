import { IProvider, IProviderWrapper, ProviderStatus, RequiredConnectorState } from '../../types'
import { ExternalProviderProxy } from './external'
import { Connector } from '../connector'
import LocalStorage from '../../helpers/localStorage'

export class ProviderWrapper extends ExternalProviderProxy implements IProviderWrapper {
    private readonly impl: IProvider

    constructor(
        impl: IProvider,
        params: { connector: Connector; state: RequiredConnectorState; storage: LocalStorage }
    ) {
        super(params)
        this.impl = impl
    }

    get id() {
        return this.impl.id
    }

    get name() {
        return this.impl.name
    }

    get logo() {
        return this.impl.logo
    }

    async connect() {
        try {
            super._patchGlobalState({ status: ProviderStatus.LOADING })
            const provider = await this.impl.connectImpl()
            await this.enable(provider)
            super._patchGlobalState({ provider: this, status: ProviderStatus.CONNECTED })
            if (this.options.cache.enabled) {
                this._storage.set(this.id)
            }
        } catch (error: any) {
            super._patchGlobalState({ provider: undefined, status: ProviderStatus.ERROR, error })
        }

        return this.impl
    }

    async disconnect() {
        try {
            super._patchGlobalState({ status: ProviderStatus.LOADING })
            await this.impl.disconnectImpl()
            this.disable()
            if (this.options.cache.enabled) {
                this._storage.remove()
            }
        } catch (error: any) {
            super._patchGlobalState({ provider: undefined, status: ProviderStatus.ERROR, error })
        }
    }
}
