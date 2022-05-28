import { ChainIdNotAllowedError } from './error'

export const MAX_SAFE_CHAIN_ID = 4503599627370476

export const validateChainId = (chainId: number) => {
    if (!Number.isInteger(chainId) || chainId <= 0 || chainId > MAX_SAFE_CHAIN_ID) {
        return new Error(`Invalid chainId ${chainId}`)
    }
}

export const ensureChainIdAllowed = (chainId: number, allowedChainIds: number[]) => {
    const isAllowed = allowedChainIds.some((id) => chainId === id)
    if (!isAllowed) {
        return new ChainIdNotAllowedError(chainId, allowedChainIds)
    }
}

export const parseChainId = (chainId: string | number) =>
    typeof chainId === 'number' ? chainId : Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
