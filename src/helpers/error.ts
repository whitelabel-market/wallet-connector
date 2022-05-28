export class ProviderNotInitializedError extends Error {
    public constructor() {
        super(`Provider not initialized`)
        this.name = ProviderNotInitializedError.name
        Object.setPrototypeOf(this, ProviderNotInitializedError.prototype)
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
