import FrameLogo from './logo.svg'
import { IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'
import type ethProviderType from 'eth-provider'
import { AbstractConnector } from '../../core/connectorImpl/abstract'

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
        return this.ethProvider('frame') as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createConnector<FrameInitArgs>(new FrameConnector())
