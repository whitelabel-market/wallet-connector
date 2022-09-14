import StatusIndicator from "./StatusIndicator";
import {ChainIdNotAllowedError} from "@whitelabel-solutions/wallet-connector";

function ConnectorCardTable({connector}) {
    return (
        <table>
            <tbody>
            <tr>
                <td>Id</td>
                <td>
                    {connector?.id}
                </td>
            </tr>
            <tr>
                <td>Status</td>
                <td>
                    <StatusIndicator
                        connected={connector.connected}
                        error={!!connector.error}
                        loading={connector.loading}/>
                </td>
            </tr>
            <tr>
                <td>Selected Account</td>
                <td>{connector?.selectedAccount ?? 'None'}</td>
            </tr>
            <tr>
                <td>Error</td>
                <td>{connector.error ? connector.error.message : 'None'}</td>
            </tr>
            <tr>
                <td>Chain Id</td>
                <td>{connector?.chainId ?? 'None'}</td>
            </tr>
            </tbody>
        </table>)
}

export default function ConnectorCard({connector}) {
    const connect = async () => {
        console.log("connect")
       const res = await connector?.connect()
        console.log("connected?", res)
        if (connector?.error instanceof ChainIdNotAllowedError) {
            console.warn("Invalid Chainid")
        }
    }

    const label = connector?.connected ? "Disconnect" :
        (connector?.loading ? "Loading" :
            (connector?.error ? "Try Again" : "Connect"))

    return (<div className="card">
            <div className="card-header">
                <h2>{connector.name}</h2>
            </div>

            <div className="card-body">
                <ConnectorCardTable connector={connector}/>
                <button onClick={() => connector.connected ? connector.disconnect() : connect()}>
                    {label}
                </button>
            </div>
        </div>
    )
}
