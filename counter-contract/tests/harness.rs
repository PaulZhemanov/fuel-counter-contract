use fuels::{prelude::*, tx::ContractId};

// Load abi from json
abigen!(Contract(
    name = "Counter",
    abi = "out/debug/counter-contract-abi.json"
));

async fn get_contract_instance() -> (Counter<WalletUnlocked>, ContractId) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./out/debug/counter-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxParameters::default())
    .await
    .unwrap();

    let instance = Counter::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn can_get_contract_id() {
    let (instance, _id) = get_contract_instance().await;
    let count = instance.methods().count().simulate().await.unwrap().value;
    assert!(count == 0);
    instance.methods().increment().call().await.unwrap();
    let count = instance.methods().count().simulate().await.unwrap().value;
    assert!(count == 1);
}
