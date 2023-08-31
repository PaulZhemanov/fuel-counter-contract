use std::str::FromStr;

use fuels::prelude::*;

// Load abi from json
abigen!(Contract(
    name = "Counter",
    abi = "out/debug/counter-contract-abi.json"
));

const RPC: &str = "beta-4.fuel.network";

const COUNTER_ADDRESS: &str = "0xce3dddd28c0c6c1cb4a4241943dcfcad6bed6657e659f1a97a7ab2b7b49c3216";

#[tokio::test]
async fn can_get_contract_id() {
    dotenv::dotenv().ok();
    let provider = Provider::connect(RPC).await.unwrap();
    let secret = std::env::var("ADMIN").unwrap();
    let wallet =
        WalletUnlocked::new_from_private_key(secret.parse().unwrap(), Some(provider.clone()));

    let id = ContractId::from_str(COUNTER_ADDRESS).unwrap();
    let instance = Counter::new(id, wallet.clone());

    instance
        .methods()
        .increment()
        .tx_params(TxParameters::default().with_gas_price(1))
        .call()
        .await
        .unwrap();

    let counter = instance.methods().count().simulate().await.unwrap().value;

    println!("counter = {counter}");
}
