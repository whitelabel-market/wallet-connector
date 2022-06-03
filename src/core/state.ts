import { ConnectorState, RequiredConnectorState } from '../types'

export class StateProxy {
    protected state: RequiredConnectorState

    constructor(initialState: RequiredConnectorState) {
        this.state = initialState
    }

    patchState(state: Partial<ConnectorState>) {
        this.state = { ...this.state, ...state } as RequiredConnectorState
    }

    get options() {
        return this.state.options
    }
    get provider() {
        return this.state.provider
    }
    get accounts() {
        return this.state.accounts
    }
    get chainId() {
        return this.state.chainId
    }
    get error() {
        return this.state.error
    }
    get status() {
        return this.state.status
    }
    get address() {
        return this.state?.accounts ? undefined : this.state.accounts[0]
    }
}
