import ethProvider from 'eth-provider'
import FrameLogo from './logo.svg'
import { AbstractExternalProvider } from '../../core/ExternalProvider'
import { ConnectResult, ProviderType } from '../../types'

export class FrameProvider extends AbstractExternalProvider {
    constructor() {
        super('Frame', FrameLogo, ProviderType.WEB)
    }

    async _connect(): ConnectResult {
        return ethProvider('frame')
    }
}

export default () => new FrameProvider()
