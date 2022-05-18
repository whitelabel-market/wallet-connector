import ethProvider from 'eth-provider'
import { ProviderType } from '@wallet-connector/types'
import FrameLogo from './logo.svg'
import { ExternalProvider } from '@wallet-connector/core/ExternalProvider'

async function onConnect() {
    return ethProvider('frame')
}

export default new ExternalProvider('Frame', FrameLogo, ProviderType.WEB, onConnect)
