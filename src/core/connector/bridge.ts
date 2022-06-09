import { IConnector } from '../../types'
import { ConnectorWrapperBase } from './base'

export class ConnectorBridge extends ConnectorWrapperBase {
    constructor(protected readonly _impl: IConnector) {
        super()
    }

    get id() {
        return this._impl.id
    }

    get name() {
        return this._impl.name
    }

    get logo() {
        return this._impl.logo
    }
}
