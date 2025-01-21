import { createClient, print } from 'redis';

// Create Redis client
const client = createClient();

// Handle successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Handle connection errors
client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

// Store hash values
function setHashValues() {
    client.hset(
        'ALX',
        'Portland', '50',
        'Seattle', '80',
        'New York', '20',
        'Bogota', '20',
        'Cali', '40',
        'Paris', '2',
        print
    );
}

// Display hash values
function displayHash() {
    client.hgetall('ALX', (err, result) => {
        if (err) {
            console.log(`Error: ${err}`);
            throw err;
        }
        console.log(result);
    });
}

// Execute operations
function main() {
    setHashValues();
    displayHash();
}

main();