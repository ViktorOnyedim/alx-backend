import express from "express";
import kue from "kue";
import { createClient } from "redis";
import { promisify } from "util";

// Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Initialize seat count and reservation status
const INITIAL_SEATS = 50;
let reservationEnabled = true;

// Kue queue
const queue = kue.createQueue();

// Reserve seats in Redis
async function reserveSeat(number) {
  await setAsync("available_seats", number);
}

// Get current number of available seats from Redis
async function getCurrentAvailableSeats() {
  const seats = await getAsync("available_seats");
  return parseInt(seats, 10) || 0;
}

// Initialize available seats
(async () => {
  await reserveSeat(INITIAL_SEATS);
})();

// Express server
const app = express();
const PORT = 1245;

// Route: GET /available_seats
app.get("/available_seats", async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

// Route: GET /reserve_seat
app.get("/reserve_seat", (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: "Reservation are blocked" });
  }

  const job = queue.create("reserve_seat").save((err) => {
    if (err) {
      return res.json({ status: "Reservation failed" });
    }
    res.json({ status: "Reservation in process" });
  });

  job.on("complete", () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on("failed", (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route: GET /process
app.get("/process", async (req, res) => {
  res.json({ status: "Queue processing" });

  queue.process("reserve_seat", async (job, done) => {
    const seats = await getCurrentAvailableSeats();
    if (seats <= 0) {
      reservationEnabled = false;
      return done(new Error("Not enough seats available"));
    }

    await reserveSeat(seats - 1);
    if (seats - 1 === 0) reservationEnabled = false;

    done();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
