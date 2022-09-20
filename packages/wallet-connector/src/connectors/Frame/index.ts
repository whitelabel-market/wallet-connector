import FrameLogo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import type ethProviderType from 'eth-provider'
import { AbstractConnector } from '../../core/connectorImpl/abstract-connector'

export type FrameInitArgs = {
    ethProvider: typeof ethProviderType
}

export class FrameConnector extends AbstractConnector<FrameInitArgs> {
    ethProvider: FrameInitArgs['ethProvider']

    constructor() {
        super('Frame', FrameLogo)
    }

    initImpl({ ethProvider }: FrameInitArgs) {
        this.ethProvider = ethProvider
        return this
    }

    async connectImpl() {
        this.provider = this.ethProvider('frame') as unknown as IExternalProvider
        const [accounts, chainId] = await Promise.all([this._ethRequestAccounts(), this._getEthChainId()])
        return { accounts, chainId }
    }

    async disconnectImpl() {
        this.provider = undefined
    }
}

export default createConnector<FrameInitArgs>(new FrameConnector())
