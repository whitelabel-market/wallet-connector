import fs from "fs";
import type { Options as ESBuildOptions } from "rollup-plugin-esbuild";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import type { OutputOptions, Plugin, RollupOptions } from "rollup";
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

for (const {
    globals,
    name,
    external,
    iife,
    build,
    cjs,
    mjs,
    dts,
    target,
} of packages) {
    if (build === false) continue;

    const iifeGlobals = {
        "@coinbase/wallet-sdk": "CoinBase",
        "@walletconnect/web3-provider": "WalletConnect",
        "authereum/dist": "Authereum",
        "eth-provider": "EthProvider",
        fortmatic: "Fortmatic",
        ...(globals || {}),
    };

    const iifeName = "WalletConnectorVue";
    const functionNames = ["index"];

    for (const fn of functionNames) {
        const input =
            fn === "index" ? `src/index.ts` : `packages/${name}/${fn}/index.ts`;

        const output: OutputOptions[] = [];

        if (mjs !== false) {
            output.push({
                file: `./dist/${fn}.mjs`,
                format: "es",
            });
        }

        if (cjs !== false) {
            output.push({
                file: `./dist/${fn}.cjs`,
                format: "cjs",
            });
        }

        if (iife !== false) {
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
        }

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

        if (dts !== false) {
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
}

export default configs;
