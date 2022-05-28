import Logo from './logo.svg'
import { AbstractInjectedProvider } from '../../core/InjectedProvider'

export class MetaMaskProvider extends AbstractInjectedProvider {
    constructor() {
        super('MetaMask', Logo)
    }
}

export default () => new MetaMaskProvider()
