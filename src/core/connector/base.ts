import { ConnectorStatus, IExternalProvider } from '../../types'

export class ConnectorWrapperBase {
    provider: IExternalProvider | undefined
    error: Error | undefined
    status: ConnectorStatus

    constructor() {
        this.status = ConnectorStatus.DISCONNECTED
    }

    protected _baseRemoveAllListeners() {
        this.provider?.removeAllListeners()
    }

    protected _reportError(error: Error) {
        this.error = error
        this.status = ConnectorStatus.ERROR
    }
}
