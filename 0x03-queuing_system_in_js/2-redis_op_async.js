import { createClient, print } from 'redis';
import { promisify } from 'util';

// Create Redis client
const client = createClient();

// Handle successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

// Promisify the Redis get command
const getAsync = promisify(client.get).bind(client);

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
    try {
        const result = await getAsync(schoolName);
        console.log(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function main() {
    await displaySchoolValue('ALX');
    setNewSchool('ALXSanFrancisco', '100');
    await displaySchoolValue('ALXSanFrancisco');
}

main();