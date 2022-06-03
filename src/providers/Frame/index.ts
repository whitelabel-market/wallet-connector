import ethProvider from 'eth-provider'
import FrameLogo from './logo.svg'
import { AbstractProvider, IExternalProvider, ProviderType } from '../../types'
import { createProvider } from '../../core/provider/construction'

export class FrameProvider extends AbstractProvider {
    constructor() {
        super('Frame', FrameLogo, ProviderType.WEB)
    }

    async connectImpl() {
        return ethProvider('frame') as unknown as IExternalProvider
    }

    async disconnectImpl() {
        // ToDo
        return null
    }
}

export default createProvider(new FrameProvider())
