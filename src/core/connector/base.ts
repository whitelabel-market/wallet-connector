import { ConnectorStatus, IExternalProvider } from '../../types'

export class ConnectorWrapperBase {
    provider: IExternalProvider | undefined
    error: Error | undefined
    status: ConnectorStatus

    constructor() {
        this.status = ConnectorStatus.DISCONNECTED
    }

    protected removeAllListeners() {
        this.provider?.removeAllListeners()
    }

    protected reportError(error: Error) {
        this.error = error
        this.status = ConnectorStatus.ERROR
    }
}
