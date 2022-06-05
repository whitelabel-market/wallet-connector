import { AddEthereumChainParameter, IConnector, RequiredConnectionOptions } from '../../types'
import { ConnectorBridge } from './bridge'

export class ConnectorWrapperWithChainId extends ConnectorBridge {
    chainId: number | undefined

    private readonly desiredChainId: string | null
    private validator: ChainIdValidator

    constructor(impl: IConnector, private options: RequiredConnectionOptions) {
        super(impl)
        this.validator = new ChainIdValidator(options.allowedChainIds)
        this.desiredChainId = this.validator.parseDesiredChainId(options.desiredChainOrChainId)
    }

    protected addChainChangedListener() {
        this.provider?.on('chainChanged', this.onChainChanged.bind(this))
    }

    protected async getChainId(): Promise<number | undefined> {
        const chainId = await this.getChainIdFromEthChainId()
        return this.onChainChanged(chainId)
    }

    protected async onChainChanged(newChainId: number | string) {
        try {
            const chainId = this.validator.parse(newChainId)
            this.validator.validate(chainId)
            this.validator.ensureAllowanceIfIntended(chainId)
            return (this.chainId = chainId)
        } catch (error: any) {
            if (error instanceof ChainIdNotAllowedError && !!this.desiredChainId) {
                try {
                    await this.switchOrAddEthChain()
                } catch (error: any) {
                    this.reportError(error)
                }
            } else {
                this.reportError(error)
            }
        }
    }

    private switchOrAddEthChain() {
        try {
            return this.switchEthChain()
        } catch (error: any) {
            const { desiredChainOrChainId } = this.options
            const desiredChainIsObject = desiredChainOrChainId && typeof desiredChainOrChainId !== 'number'
            if (error.code === 4902 && desiredChainIsObject) {
                try {
                    return this.addEthChain()
                } catch (error: any) {
                    this.reportError(error)
                }
            } else {
                this.reportError(error)
            }
        }
    }

    private switchEthChain() {
        return this.provider?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: this.desiredChainId }],
        })
    }

    private addEthChain() {
        return this.provider?.request({
            method: 'wallet_addEthereumChain',
            params: [
                { ...(this.options.desiredChainOrChainId as AddEthereumChainParameter), chainId: this.desiredChainId },
            ],
        })
    }

    private async getChainIdFromEthChainId(): Promise<string> {
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

    constructor(private allowedChainIds: number[] | null) {}

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
        if (!Number.isInteger(chainId) || chainId <= 0 || chainId > ChainIdValidator.MAX_SAFE_CHAIN_ID) {
            return new Error(`Invalid chainId ${chainId}`)
        }
    }

    ensureAllowanceIfIntended(chainId: number) {
        const isIntended = !!this.allowedChainIds && this.allowedChainIds.length > 0
        if (isIntended) {
            this.ensureAllowance(chainId)
        }
    }

    ensureAllowance(chainId: number) {
        const isAllowed = this.allowedChainIds?.some((id) => chainId === id)
        if (!isAllowed) {
            throw new ChainIdNotAllowedError(chainId, this.allowedChainIds || [])
        }
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
