import { AbstractProviderBase } from './BaseProvider'
import { ProviderType } from '../types'

export abstract class AbstractExternalProvider<T = Record<string, unknown>> extends AbstractProviderBase<T> {
    protected constructor(name: string, logo: string, type: ProviderType, options: T = {} as T) {
        super(name, logo, type, options)
    }
}
