import FrameLogo from './logo.svg'
import { AbstractConnector, IExternalProvider } from '../../types'
import { createConnector } from '../../helpers/construction'

export class FrameConnector extends AbstractConnector {
    constructor() {
        super('Frame', FrameLogo)
    }

    async connectImpl() {
        const { default: ethProvider } = await import('eth-provider')
        return ethProvider('frame') as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createConnector(new FrameConnector())
