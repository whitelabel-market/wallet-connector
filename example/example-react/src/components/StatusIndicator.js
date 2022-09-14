export default function StatusIndicator({loading, error, connected}) {
    return (<div className="status-indicator">
            <span className="status" style={{
                backgroundColor: loading ? "#f0ad4e" : (error ? "#d9534f" : (
                    connected ? "#5cb85c" : "#e5e5e5"))
            }}/>
            <span>{loading ? "Loading" : (error ? "Error" : (
                connected ? "Connected" : "Disconnected"))}</span>
        </div>
    )
}
