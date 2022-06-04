import { IConnector } from '../../types'
import { ConnectorBridge } from './bridge'

export class ConnectorWrapperWithChainId extends ConnectorBridge {
    chainId: number | undefined
    private validator: ChainIdValidator

    constructor(impl: IConnector, private allowedChainIds: number[] | null) {
        super(impl)
        this.validator = new ChainIdValidator()
    }

    protected _addChainChangedListener() {
        this.provider?.on('chainChanged', this._onChainChanged)
        this.provider?.on('connect', ({ chainId }) => this._onChainChanged(chainId))
    }

    protected async _getChainId(): Promise<number> {
        const chainId = await this._getChainIdFromEthChainId()
        return this._onChainChanged(chainId)
    }

    protected _onChainChanged(newChainId: number | string) {
        const chainId = this.validator.parse(newChainId)
        this.validator.validate(chainId)
        if (this.allowedChainIds && this.allowedChainIds.length > 0) {
            this.validator.ensureAllowance(chainId, this.allowedChainIds)
        }
        return (this.chainId = chainId)
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

class ChainIdValidator {
    static MAX_SAFE_CHAIN_ID = 4503599627370476

    parse(chainId: number | string) {
        if (typeof chainId === 'number') {
            return chainId
        } else {
            return Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
        }
    }

    validate(chainId: number) {
        if (!Number.isInteger(chainId) || chainId <= 0 || chainId > ChainIdValidator.MAX_SAFE_CHAIN_ID) {
            return new Error(`Invalid chainId ${chainId}`)
        }
    }

    ensureAllowance(chainId: number, allowedChainIds: number[]) {
        const isAllowed = allowedChainIds.some((id) => chainId === id)
        if (!isAllowed) {
            throw new ChainIdNotAllowedError(chainId, allowedChainIds)
        }
    }
}
