library;
use std::constants::ZERO_B256;

pub struct Counter {
    value: u64,
    caller: Identity,
    timestamp: u64,
}


impl Counter {
    pub fn default() -> Self {
        Counter {
            value: 0,
            caller: Identity::Address(Address::from(ZERO_B256)),
            timestamp: 0,
        }
     }
}
