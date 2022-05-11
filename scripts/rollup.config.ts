import type { Options as ESBuildOptions } from "rollup-plugin-esbuild";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import type { OutputOptions, RollupOptions } from "rollup";
import { packages } from "../meta/packages";
import svg from "rollup-plugin-svg";

const configs: RollupOptions[] = [];

const esbuildPlugin = esbuild();

const dtsPlugin = [dts()];

const externals = [
    "@coinbase/wallet-sdk",
    "@walletconnect/web3-provider",
    "authereum/dist",
    "eth-provider",
    "fortmatic",
];

const esbuildMinifer = (options: ESBuildOptions) => {
    const { renderChunk } = esbuild(options);

    return {
        name: "esbuild-minifer",
        renderChunk,
    };
};

for (const { name, external, target } of packages) {
    const iifeGlobals = {
        "@whitelabel-solutions/wallet-connector": "WalletConnector",
        "@coinbase/wallet-sdk": "CoinBaseWallet",
        "@walletconnect/web3-provider": "WalletConnect",
        "authereum/dist": "Authereum",
        "eth-provider": "EthProvider",
        fortmatic: "Fortmatic",
    };

    const iifeName = "WalletConnectorVue";
    const functionNames = ["index"];

    for (const fn of functionNames) {
        const input =
            fn === "index" ? `src/index.ts` : `packages/${name}/${fn}/index.ts`;

        const output: OutputOptions[] = [];

        output.push({
            file: `./dist/${fn}.mjs`,
            format: "es",
        });

        output.push({
            file: `./dist/${fn}.cjs`,
            format: "cjs",
        });

        output.push(
            {
                file: `./dist/${fn}.iife.js`,
                format: "iife",
                name: iifeName,
                extend: true,
                globals: iifeGlobals,
            },
            {
                file: `./dist/${fn}.iife.min.js`,
                format: "iife",
                name: iifeName,
                extend: true,
                globals: iifeGlobals,
                plugins: [
                    esbuildMinifer({
                        minify: true,
                    }),
                ],
            }
        );

        configs.push({
            input,
            output,
            plugins: [
                peerDepsExternal(),
                target ? esbuild({ target }) : esbuildPlugin,
                json(),
                svg(),
            ],
            external: [...externals, ...(external || [])],
        });

        configs.push({
            input,
            output: {
                file: `./dist/${fn}.d.ts`,
                format: "es",
            },
            plugins: dtsPlugin,
            external: [...externals, ...(external || [])],
        });
    }
}

export default configs;
