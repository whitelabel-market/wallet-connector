import {CoinbaseWallet, Connection, MetaMask, WalletConnect} from "@whitelabel-solutions/wallet-connector";
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectProvider from "@metamask/detect-provider"
import ConnectionCard from "./components/ConnectionCard";
import ConnectorCard from "./components/ConnectorCard";
import {useEffect} from "react";

function App() {
    /**
     * @remarks
     * This example is currently NOT working, due to reactivity issues
     */
    const appName = "wallet-connector-example-react"
    const infuraId = "69b854375f754ababacab55f40fceca8"
    const chainId = 1
    const options = {
        allowedChainIds: [chainId, 3],
        desiredChainOrChainId: chainId,
        cache: {
            enabled: true
        }
    }

    const connectors = [
        MetaMask({detectProvider}),
        WalletConnect({WalletConnectProvider, options: {infuraId}}),
        CoinbaseWallet({
            CoinbaseWalletSDK,
            options: {
                appName,
                rpcUrl: "https://mainnet.infura.io/v3/" + infuraId,
                chainId
            },
        })
    ]

    const connection = new Connection(options, connectors)

    useEffect(() => {
        void connection.loadFromCache()
    }, [])

    return (
        connection ?
            <div>
                <div className="container">
                    <div className="grid">
                        <ConnectionCard connection={connection} className="connection-card"/>
                    </div>
                    <div className="grid">
                        {Object.values(connection.connectors).map(connector => (
                            <div key={connector.id}>
                                <span>Error: {connector.error}.</span>
                                <ConnectorCard connector={connector}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div> : <div>Loading</div>);
}

export default App;
