extern crate alloc;
use fuel_indexer_utils::prelude::*;

#[indexer(manifest = "counter_indexer.manifest.yaml")]
pub mod counter_indexer_index_mod {

    fn handle_block(block: BlockData) {
        let height = block.height;
        let txs = block.transactions.len();
        info!("🧱 Block height: {height} | transacrions: {txs}");
    }

    fn handle_increment_params(data: IncrementParams) {
        Logger::info(format!("✨ IncrementParams: {:#?}", data).as_str());
        let increment = Increment {
            id: SizedAsciiString::try_from(data.counter.to_string()).unwrap(),
            caller: data.caller,
            counter: data.counter,
            timestamp: data.timestamp,
        };
        increment.save();
    }
}
