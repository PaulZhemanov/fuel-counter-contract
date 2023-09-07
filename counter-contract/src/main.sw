contract;
mod structs;
mod events;
use structs::*;
use events::*;

use std::logging::log;
use std::auth::msg_sender;

storage {
    counter: Counter = Counter::default(),
}

abi CounterContract {
    #[storage(read, write)]
    fn increment();

    #[storage(read)]
    fn count() -> u64;
}

impl CounterContract for Contract {
    #[storage(read)]
    fn count() -> u64 {
        storage.counter.value.try_read().unwrap_or(0)
    }

    #[storage(read, write)]
    fn increment() {
        let value = storage.counter.value.try_read().unwrap_or(0) + 1;
        let counter = Counter {
            value: value,
            caller: msg_sender().unwrap(),
            timestamp: std::block::timestamp(),
        };
        storage.counter.write(counter);
        log(IncrementEvent {counter});
    }
}
