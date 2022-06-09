import { AddEthereumChainParameter, IConnector, RequiredConnectionOptions } from '../../types'
import { ConnectorBridge } from './bridge'
import { events } from './base'

export class ConnectorWrapperWithChainId extends ConnectorBridge {
    chainId: number | undefined

    private _validator: ChainIdValidator

    constructor(impl: IConnector, private options: RequiredConnectionOptions) {
        super(impl)
        this._validator = new ChainIdValidator(options)
    }

    get desiredChainId() {
        return this._validator.desiredChainId
    }

    protected async _validateChainId(newChainId: number | string) {
        const chainId = this._validator.parse(newChainId)
        const error = this._validator.validate(chainId)
        if (error) {
            this._reportError(error)
            if (error instanceof ChainIdNotDesiredError) {
                await this._switchOrAddEthChain()
            }
        } else {
            this.error = undefined
        }
        return chainId
    }

    protected _addChainChangedListener() {
        this.provider?.on('chainChanged', this._onChainChanged.bind(this))
    }

    protected async _getChainId(): Promise<number | undefined> {
        const chainId = await this._getChainIdFromEthChainId()
        this.chainId = await this._validateChainId(chainId)
        return this.chainId
    }

    protected async _onChainChanged(chainId: number | string) {
        try {
            this.loading = true
            this.chainId = await this._validateChainId(chainId)
            this.emit(events.CHAIN_CHANGED, this.chainId)
            this.loading = false
        } catch (error: any) {
            this._reportError(error)
        }
    }

    private async _switchOrAddEthChain() {
        let error = await this._switchEthChain()
        if (error) {
            const { desiredChainOrChainId } = this.options
            const desiredChainIsObject = desiredChainOrChainId && typeof desiredChainOrChainId !== 'number'
            if (error.code === 4902 && desiredChainIsObject) {
                error = await this._addEthChain()
            }
        }
        if (error) {
            return error
        }
        this.error = undefined
        this.emit(events.SWITCH_CHAIN, this._validator.parse(this.desiredChainId as string))
    }

    private async _switchEthChain() {
        try {
            await this.provider?.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.desiredChainId }],
            })
            this.emit(events.SWITCH_CHAIN, this._validator.parse(this.desiredChainId as string))
        } catch (error: any) {
            return error
        }
    }

    private async _addEthChain() {
        const params = {
            ...(this.options.desiredChainOrChainId as AddEthereumChainParameter),
            chainId: this.desiredChainId,
        }

        try {
            await this.provider?.request({
                method: 'wallet_addEthereumChain',
                params: [params],
            })
            this.emit(events.ADD_CHAIN, params)
        } catch (error: any) {
            return error
        }
    }

    private async _getChainIdFromEthChainId(): Promise<string> {
        return this.provider?.request({
            method: 'eth_chainId',
        }) as Promise<string>
    }
}

export class ChainIdNotAllowedError extends Error {
    public readonly chainId: number

    public constructor(chainId: number, allowedChainIds: number[]) {
        super(`chainId ${chainId} not included in ${allowedChainIds.toString()}`)
        this.chainId = chainId
        this.name = ChainIdNotAllowedError.name
        Object.setPrototypeOf(this, ChainIdNotAllowedError.prototype)
    }
}

export class ChainIdNotDesiredError extends Error {
    public readonly chainId: number

    public constructor(chainId: number, desiredChainId: number) {
        super(`chainId ${chainId} not desired as ${desiredChainId}`)
        this.chainId = chainId
        this.name = ChainIdNotDesiredError.name
        Object.setPrototypeOf(this, ChainIdNotDesiredError.prototype)
    }
}

class ChainIdValidator {
    static MAX_SAFE_CHAIN_ID = 4503599627370476

    desiredChainId: string | null
    allowedChainIds: number[] | null

    constructor(options: RequiredConnectionOptions) {
        this.desiredChainId = this.parseDesiredChainId(options.desiredChainOrChainId)
        this.allowedChainIds = options.allowedChainIds
    }

    parse(chainId: number | string) {
        if (typeof chainId === 'number') {
            return chainId
        } else {
            return Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
        }
    }

    parseHex(chainId: number | string) {
        return '0x' + this.parse(chainId).toString(16)
    }

    validate(chainId: number) {
        try {
            this.validateChainIdFormat(chainId)
            this.validateChainIdAllowed(chainId)
            this.validateChainIdDesired(chainId)
        } catch (error: any) {
            return error
        }
    }

    validateChainIdFormat(chainId: number) {
        if (!Number.isInteger(chainId) || chainId <= 0 || chainId > ChainIdValidator.MAX_SAFE_CHAIN_ID) {
            throw new Error(`ChainId ${chainId} invalid: Unsupported format`)
        } else {
            return true
        }
    }

    validateChainIdDesired(chainId: number) {
        if (this.desiredChainId) {
            const desiredChainId = this.parse(this.desiredChainId as string)
            if (chainId !== desiredChainId) {
                throw new ChainIdNotDesiredError(chainId, desiredChainId)
            }
        }
        return true
    }

    validateChainIdAllowed(chainId: number) {
        if (!!this.allowedChainIds && this.allowedChainIds.length > 0) {
            const isAllowed = this.allowedChainIds?.some((id) => chainId === id)

            if (!isAllowed) {
                throw new ChainIdNotAllowedError(chainId, this.allowedChainIds || [])
            }
        }
        return true
    }

    parseDesiredChainId(desiredChainOrChainId: number | AddEthereumChainParameter | null) {
        if (desiredChainOrChainId) {
            const chainId =
                typeof desiredChainOrChainId === 'number' ? desiredChainOrChainId : desiredChainOrChainId?.chainId
            return this.parseHex(chainId)
        } else {
            return null
        }
    }
}
