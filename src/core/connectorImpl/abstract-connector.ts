import generateId from '../../helpers/id'
import { IConnector, ConnectImplReturnValue } from '../../types'
import { AbstractExternalProvider } from './abstract-external'

export abstract class AbstractConnector<T = void> extends AbstractExternalProvider implements IConnector<T> {
    id: string

    protected constructor(public name: string, public logo: string) {
        super()
        this.id = generateId(this.name)
    }

    abstract initImpl(args: T): IConnector<T>
    abstract connectImpl(): Promise<ConnectImplReturnValue>
    abstract disconnectImpl(): void
}
