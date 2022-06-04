export const MAX_SAFE_CHAIN_ID = 4503599627370476

export class ChainIdNotAllowedError extends Error {
    public readonly chainId: number

    public constructor(chainId: number, allowedChainIds: number[]) {
        super(`chainId ${chainId} not included in ${allowedChainIds.toString()}`)
        this.chainId = chainId
        this.name = ChainIdNotAllowedError.name
        Object.setPrototypeOf(this, ChainIdNotAllowedError.prototype)
    }
}

export const validateChainId = (chainId: number) => {
    if (!Number.isInteger(chainId) || chainId <= 0 || chainId > MAX_SAFE_CHAIN_ID) {
        return new Error(`Invalid chainId ${chainId}`)
    }
}

export const ensureChainIdAllowed = (chainId: number, allowedChainIds: number[]) => {
    const isAllowed = allowedChainIds.some((id) => chainId === id)
    if (!isAllowed) {
        throw new ChainIdNotAllowedError(chainId, allowedChainIds)
    }
}

export const parseChainId = (chainId: string | number) =>
    typeof chainId === 'number' ? chainId : Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
