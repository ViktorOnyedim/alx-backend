import { createClient, print } from 'redis';

// Create Redis client
const client = createClient();

// Handle successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
    console.log(result);
  });
}

displaySchoolValue("ALX");
setNewSchool("ALXSanFrancisco", "100");
displaySchoolValue("ALXSanFrancisco");