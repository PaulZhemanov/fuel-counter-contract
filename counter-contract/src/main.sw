contract; 


storage {   
    counter: u64 = 0,
}
 
abi Counter {
    #[storage(read, write)]
    fn increment();

    #[storage(read)]
    fn count() -> u64;
}


impl Counter for Contract { 
    #[storage(read)]
    fn count() -> u64 {
        storage.counter.try_read().unwrap_or(0)
    }

    #[storage(read, write)]
    fn increment() {
        let incremented = storage.counter.try_read().unwrap_or(0) + 1;
        storage.counter.write(incremented);
    }
}
