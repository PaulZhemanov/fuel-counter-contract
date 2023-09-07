import React, { useEffect, useState } from "react";
import "@fuel-wallet/sdk";
import "./App.css";
// Import the contract factory -- you can find the name in index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { useFuel } from "./hooks/useFuel";
import { useIsConnected } from "./hooks/useIsConnected";
import { CounterContractAbi__factory } from "./contracts";

const NODE_URL = "https://beta-4.fuel.network/graphql";
// The address of thes contract deployed the Fuel testnet
const COUNTER_ID =
    "0xce3dddd28c0c6c1cb4a4241943dcfcad6bed6657e659f1a97a7ab2b7b49c3216";

function App() {
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState<number | null>(null);
    const [fuel, , fuelLoading] = useFuel();
    const [isConnected] = useIsConnected();

    useEffect(() => {
        update_counter()
    }, [fuel, isConnected])

    async function update_counter() {
        setLoading(true);
        isConnected && fuel
            .currentAccount()
            .then((account) => fuel.getWallet(account))
            .then((wallet) => CounterContractAbi__factory.connect(COUNTER_ID, wallet))
            .then(instance => instance.functions.count().simulate())
            .then((res) => setCounter(res.value.toNumber()))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }

    async function increment() {
        setLoading(true);
        fuel
            .currentAccount()
            .then((account) => fuel.getWallet(account))
            .then((wallet) => CounterContractAbi__factory.connect(COUNTER_ID, wallet))
            .then(instance => instance.functions.increment().txParams({ gasPrice: 1 }).call())
            .then(update_counter)
            .catch(e => console.error(e))
            .finally(() => setLoading(false))
    }

    // if (fuelLoading || loading) return <div className="App"><h3>loading</h3></div>

    return (
        <div className="App">
            {isConnected && <h3>Counter: {counter == null ? "loading" : counter?.toFixed(0)}</h3>}
            {
                isConnected ? (
                    <button style={buttonStyle} onClick={increment}>Increment</button>
                ) : (
                    <button style={buttonStyle} onClick={() => fuel.connect()}>Connect</button>
                )
            }
        </div>
    );
}

export default App;

const buttonStyle = {
    borderRadius: "48px",
    marginTop: "10px",
    backgroundColor: "#03ffc8",
    fontSize: "20px",
    fontWeight: "600",
    color: "rgba(0, 0, 0, .88)",
    border: "none",
    outline: "none",
    height: "60px",
    width: "400px",
    cursor: "pointer"
}
