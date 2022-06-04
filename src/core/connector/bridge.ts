import { IConnector } from '../../types'
import { ConnectorWrapperBase } from './base'

export class ConnectorBridge extends ConnectorWrapperBase {
    constructor(protected readonly impl: IConnector) {
        super()
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
}
