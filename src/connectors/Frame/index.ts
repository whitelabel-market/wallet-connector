import FrameLogo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector, peerImport } from '../../helpers/construction'

export class FrameConnector extends AbstractConnector {
    constructor() {
        super('Frame', FrameLogo)
    }

    async connectImpl() {
        const ethProvider = await peerImport('eth-provider')
        return ethProvider('frame') as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createConnector(new FrameConnector())
