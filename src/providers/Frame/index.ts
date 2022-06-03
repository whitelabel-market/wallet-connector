import ethProvider from 'eth-provider'
import FrameLogo from './logo.svg'
import { AbstractConnector, IExternalProvider, ConnectorType } from '../../types'
import { createConnector } from '../../core/connector/construction'

export class FrameConnector extends AbstractConnector {
    constructor() {
        super('Frame', FrameLogo, ConnectorType.WEB)
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
