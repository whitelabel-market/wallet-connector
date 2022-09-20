import StatusIndicator from "./StatusIndicator";

function ConnectionCardTable({connection}) {
    return (<table>
        <tbody>
        <tr>
            <td>Id</td>
            <td>
                {connection.activeConnector?.id ?? 'None'}
            </td>
        </tr>
        <tr>
            <td>Status</td>
            <td>
                <StatusIndicator
                    connected={connection.activeConnector?.connected}
                    error={connection.activeConnector?.error}
                    loading={connection.activeConnector?.loading}/>
            </td>
        </tr>
        <tr>
            <td>Selected Address</td>
            <td>{connection.activeConnector?.selectedAccount ?? 'None'}</td>
        </tr>
        <tr>
            <td>Error</td>
            <td>{connection.activeConnector?.error ? connection.activeConnector.error.message : 'None'}</td>
        </tr>
        <tr>
            <td>Chain Id</td>
            <td>{connection.activeConnector?.chainId ?? 'None'}</td>
        </tr>
        </tbody>
    </table>)
}

export default function ConnectionCard({connection}) {
    return (<div className="card">
            <div className="card-header">
                <h2>Connection</h2>
            </div>

            <div className="card-body">
                <p>Easy access to the current connector state from the connection instance</p>
                <ConnectionCardTable connection={connection}/>
            </div>
        </div>
    )
}
