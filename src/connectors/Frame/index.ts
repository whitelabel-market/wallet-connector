import ethProvider from 'eth-provider'
import FrameLogo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../core/construction'

export class FrameConnector extends AbstractConnector {
    constructor() {
        super('Frame', FrameLogo)
    }

    async connectImpl() {
        return ethProvider('frame') as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createConnector(new FrameConnector())
