export const MAX_SAFE_CHAIN_ID = 4503599627370476;

export const validateChainId = (chainId: number, allowedChainId: number) => {
    if (
        !Number.isInteger(chainId) ||
        chainId <= 0 ||
        chainId > MAX_SAFE_CHAIN_ID
    ) {
        throw new Error(`Invalid chainId ${chainId}`);
    }
    if (chainId !== allowedChainId) {
        // nothing done
    }
};

export const parseChainId = (chainId: string | number) =>
    typeof chainId === "number"
        ? chainId
        : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
