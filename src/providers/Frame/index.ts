import ethProvider from 'eth-provider'
import { ProviderType } from '../../types'
import FrameLogo from './logo.svg'
import { ExternalProvider } from '../../core/ExternalProvider'

async function onConnect() {
    return ethProvider('frame')
}

export default new ExternalProvider('Frame', FrameLogo, ProviderType.WEB, onConnect)
