import generateId from '../../helpers/id'
import { IConnector, IExternalProvider } from '../../types'

export abstract class AbstractConnector<T = void> implements IConnector<T> {
    id: string

    protected constructor(public name: string, public logo: string) {
        this.id = generateId(this.name)
    }

    abstract initImpl(args: T): IConnector<T>
    abstract connectImpl(): Promise<IExternalProvider>
    abstract disconnectImpl(): void
}
