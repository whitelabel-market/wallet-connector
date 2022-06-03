import { ConnectionOptions, ConnectorState, DeepRequired, ConnectorStatus } from '../types'
import { mergeDeep } from '../helpers/mergeDeep'

export const DEFAULT_STATE: ConnectorState = {
    options: {
        allowedChainIds: null,
        cache: {
            enabled: true,
            key: 'cached-connector',
        },
    },
    provider: undefined,
    accounts: undefined,
    chainId: undefined,
    error: undefined,
    status: ConnectorStatus.DISCONNECTED,
}

export const getDefaultState = (options: Partial<ConnectionOptions>) => {
    return {
        ...DEFAULT_STATE,
        options: mergeDeep(DEFAULT_STATE.options, options),
    } as DeepRequired<ConnectorState>
}
