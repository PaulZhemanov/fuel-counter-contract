import React, { useEffect, useState } from "react";
import "@fuel-wallet/sdk"; 
import "./App.css";
// Import the contract factory -- you can find the name in index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory } from "./contracts";
import {useFuel} from "./hooks/useFuel";
import {useIsConnected} from "./hooks/useIsConnected";

// The address of the contract deployed the Fuel testnet
const CONTRACT_ID =
  "0xce3dddd28c0c6c1cb4a4241943dcfcad6bed6657e659f1a97a7ab2b7b49c3216";

function App() {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState<number>(0);
  const [fuel, error, fuelLoading] = useFuel();
  const [isConnected] = useIsConnected();

  useEffect(() => {
    setLoading(true);
    fuel
        .currentAccount()
        .then((account) => fuel.getWallet(account))
        .then((wallet) => CounterContractAbi__factory.connect(CONTRACT_ID, wallet))
        .then((contract) => contract.functions.count().simulate())
        .then((res) => setCounter(res.value.toNumber()))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
  },[])

  async function increment() {
    setLoading(true);
    fuel
        .currentAccount()
        .then((account) => fuel.getWallet(account))
        .then((wallet) => CounterContractAbi__factory.connect(CONTRACT_ID, wallet))
        .then((contract) => contract.functions.increment().call())
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
  }

  if (loading || fuelLoading) return <div>loading</div>
  
  return (
      <div className="App">
        {
          isConnected ? (
            <>
              <h3>Counter: {counter?.toFixed(0)}</h3>
              <button style={buttonStyle} onClick={increment}>
                Increment
              </button>
            </>
          ) : (
            <button style={buttonStyle}  onClick={() => fuel.connect()}>Connect</button>
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
