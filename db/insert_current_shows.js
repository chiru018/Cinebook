import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set in env variables.");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database:", DATABASE_URL.split("@")[1]); // print host info securely
  const conn = await mysql.createConnection(DATABASE_URL);

  console.log("Clearing old active shows and seats...");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  await conn.execute("TRUNCATE TABLE seats");
  await conn.execute("TRUNCATE TABLE shows");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");

  // Dates: from June 15, 2026 to June 22, 2026 (8 days)
  const dates = [
    "2026-06-15",
    "2026-06-16",
    "2026-06-17",
    "2026-06-18",
    "2026-06-19",
    "2026-06-20",
    "2026-06-21",
    "2026-06-22"
  ];

  // Theaters: IDs 1 to 6
  const theaterIds = [1, 2, 3, 4, 5, 6];

  // Movies configs for Now Showing
  const movieConfigs = [
    {
      movieId: 1, // NEBULA
      shows: [
        { time: "10:00", screen: "Screen 1", format: "2D", priceSilver: 12, priceGold: 17, pricePremium: 22 },
        { time: "16:45", screen: "Screen 3", format: "IMAX", priceSilver: 22, priceGold: 27, pricePremium: 32 }
      ]
    },
    {
      movieId: 2, // Shadow Protocol
      shows: [
        { time: "13:30", screen: "Screen 2", format: "3D", priceSilver: 16, priceGold: 21, pricePremium: 26 },
        { time: "19:30", screen: "Screen 1", format: "IMAX", priceSilver: 22, priceGold: 27, pricePremium: 32 }
      ]
    },
    {
      movieId: 3, // Eternal Waltz
      shows: [
        { time: "10:00", screen: "Screen 3", format: "2D", priceSilver: 12, priceGold: 17, pricePremium: 22 },
        { time: "13:30", screen: "Screen 2", format: "3D", priceSilver: 16, priceGold: 21, pricePremium: 26 },
        { time: "19:30", screen: "Screen 1", format: "IMAX", priceSilver: 22, priceGold: 27, pricePremium: 32 }
      ]
    },
    {
      movieId: 4, // Whispering Halls
      shows: [
        { time: "16:45", screen: "Screen 3", format: "2D", priceSilver: 12, priceGold: 17, pricePremium: 22 },
        { time: "22:15", screen: "Screen 2", format: "3D", priceSilver: 16, priceGold: 21, pricePremium: 26 }
      ]
    },
    {
      movieId: 7, // Cold Evidence
      shows: [
        { time: "13:30", screen: "Screen 1", format: "2D", priceSilver: 12, priceGold: 17, pricePremium: 22 },
        { time: "22:15", screen: "Screen 3", format: "IMAX", priceSilver: 22, priceGold: 27, pricePremium: 32 }
      ]
    }
  ];

  console.log("Generating show records...");
  const showValues = [];
  for (const dateStr of dates) {
    for (const theaterId of theaterIds) {
      for (const config of movieConfigs) {
        for (const show of config.shows) {
          showValues.push([
            config.movieId,
            theaterId,
            dateStr,
            show.time,
            show.screen,
            show.format,
            show.priceSilver,
            show.priceGold,
            show.pricePremium,
            1 // isActive
          ]);
        }
      }
    }
  }

  console.log(`Inserting ${showValues.length} shows...`);
  // Bulk insert shows
  const showSql = `
    INSERT INTO shows 
    (movie_id, theater_id, show_date, show_time, screen_name, format, price_silver, price_gold, price_premium, is_active) 
    VALUES ?
  `;
  await conn.query(showSql, [showValues]);

  // Retrieve all inserted show IDs
  const [rows] = await conn.query("SELECT id FROM shows ORDER BY id ASC");
  const showIds = rows.map(r => r.id);
  console.log(`Successfully inserted and verified ${showIds.length} shows.`);

  // Generate seats for each show
  const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const sectionMap = {
    silver: ["A", "B", "C"],
    gold: ["D", "E", "F"],
    premium: ["G", "H"]
  };

  console.log("Generating seat records...");
  const seatValues = [];
  for (const showId of showIds) {
    for (const [section, rowList] of Object.entries(sectionMap)) {
      for (const row of rowList) {
        for (let col = 1; col <= 10; col++) {
          const status = Math.random() > 0.8 ? "booked" : "available";
          seatValues.push([
            showId,
            `${row}${col}`,
            section,
            row,
            col,
            status
          ]);
        }
      }
    }
  }

  console.log(`Inserting ${seatValues.length} seats in chunks...`);
  const chunkSize = 5000;
  for (let i = 0; i < seatValues.length; i += chunkSize) {
    const chunk = seatValues.slice(i, i + chunkSize);
    const seatSql = `
      INSERT INTO seats 
      (show_id, seat_number, section, row_label, col_num, status) 
      VALUES ?
    `;
    await conn.query(seatSql, [chunk]);
    console.log(`Inserted chunk ${i / chunkSize + 1} (${chunk.length} seats)`);
  }

  await conn.end();
  console.log("Database successfully seeded with current shows!");
}

run().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
