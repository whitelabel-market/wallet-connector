import EventEmitter from 'eventemitter3'

export const events = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CHAIN_CHANGED: 'chainChanged',
    SWITCH_CHAIN: 'wallet_switchEthereumChain',
    ADD_CHAIN: 'wallet_addEthereumChain',
    ACCOUNTS_CHANGED: 'accountsChanged',
    ERROR: 'error',
}

export class ConnectorWrapperBase extends EventEmitter {
    error: Error | undefined
    loading: boolean

    constructor() {
        super()
        this.loading = false
    }

    protected _reportError(error: Error) {
        this.error = error
        this.loading = false
        this.emit(events.ERROR, error)
    }
}
