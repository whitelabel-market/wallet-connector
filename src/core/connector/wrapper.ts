import { IConnector, IConnectorWrapper, ConnectorStatus, RequiredConnectorState } from '../../types'
import { ExternalProviderProxy } from './external'
import { Connection } from '../connection'
import LocalStorage from '../../helpers/localStorage'

export class ConnectorWrapper extends ExternalProviderProxy implements IConnectorWrapper {
    private readonly impl: IConnector

    constructor(
        impl: IConnector,
        params: { connection: Connection; state: RequiredConnectorState; storage: LocalStorage }
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
            super._patchGlobalState({ status: ConnectorStatus.LOADING })
            const provider = await this.impl.connectImpl()
            await this.enable(provider)
            super._patchGlobalState({ provider: this, status: ConnectorStatus.CONNECTED })
            if (this.options.cache.enabled) {
                this._storage.set(this.id)
            }
        } catch (error: any) {
            super._patchGlobalState({ provider: undefined, status: ConnectorStatus.ERROR, error })
        }

        return this.impl
    }

    async disconnect() {
        try {
            super._patchGlobalState({ status: ConnectorStatus.LOADING })
            await this.impl.disconnectImpl()
            this.disable()
            if (this.options.cache.enabled) {
                this._storage.remove()
            }
        } catch (error: any) {
            super._patchGlobalState({ provider: undefined, status: ConnectorStatus.ERROR, error })
        }
    }
}
