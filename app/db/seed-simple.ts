// @ts-nocheck
import "dotenv/config";
import { createConnection } from "mysql2/promise";

const url = process.env.DATABASE_URL || "";

async function seed() {
  const conn = await createConnection(url);
  console.log("Connected");

  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  await conn.execute("TRUNCATE TABLE seats");
  await conn.execute("TRUNCATE TABLE shows");
  await conn.execute("TRUNCATE TABLE theaters");
  await conn.execute("TRUNCATE TABLE movies");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Truncated");

  // Insert movies
  const movieValues = [
    "('NEBULA','nebula','A lone astronaut discovers an ancient cosmic entity.','When astronaut Dr. Elena Vasquez ventures beyond our solar system, she encounters a sentient nebula.','/images/movies/nebula.jpg','/images/movies/nebula.jpg','Sci-Fi','English',148,'PG-13',8.4,'2025-01-15','Christopher Nolan','[\"Ana de Armas\",\"Oscar Isaac\",\"Benedict Cumberbatch\"]','now_showing',true)",
    "('Shadow Protocol','shadow-protocol','An elite operative uncovers a conspiracy.','Former intelligence agent Kira Tanaka uncovers a decades-old conspiracy.','/images/movies/shadow-protocol.jpg','/images/movies/shadow-protocol.jpg','Action','English',132,'R',7.9,'2025-02-20','Denis Villeneuve','[\"Florence Pugh\",\"Timothee Chalamet\",\"Idris Elba\"]','now_showing',true)",
    "('Eternal Waltz','eternal-waltz','Two lovers discover their connection transcends time.','In 1920s Vienna, a composer and ballerina fall in love.','/images/movies/eternal-waltz.jpg','/images/movies/eternal-waltz.jpg','Romance','English',125,'PG',8.1,'2025-02-14','Sofia Coppola','[\"Saoirse Ronan\",\"Paul Mescal\",\"Tilda Swinton\"]','now_showing',true)",
    "('Whispering Halls','whispering-halls','A paranormal investigator confronts the spirits of a Victorian mansion.','Paranormal psychologist Dr. Marcus Hale accepts what seems like a routine case.','/images/movies/whispering-halls.jpg','/images/movies/whispering-halls.jpg','Horror','English',118,'R',7.5,'2025-03-01','Ari Aster','[\"Joaquin Phoenix\",\"Anya Taylor-Joy\",\"Willem Dafoe\"]','now_showing',false)",
    "('Dragon\\'s Crest','dragons-crest','A young blacksmith discovers she is the last dragon rider.','In the fractured kingdom of Aldoria, blacksmith\\'s apprentice Maren discovers an ancient dragon egg.','/images/movies/dragons-crest.jpg','/images/movies/dragons-crest.jpg','Fantasy','English',155,'PG-13',8.0,'2025-04-10','Peter Jackson','[\"Millie Bobby Brown\",\"Henry Cavill\",\"Helen Mirren\"]','coming_soon',true)",
    "('The Weekend Escape','weekend-escape','Four friends luxury weekend getaway turns hilarious.','When four college friends reunite for a luxury weekend at a coastal villa.','/images/movies/weekend-escape.jpg','/images/movies/weekend-escape.jpg','Comedy','English',105,'PG-13',7.2,'2025-05-15','Greta Gerwig','[\"Jennifer Lawrence\",\"Ryan Reynolds\",\"Awkwafina\"]','coming_soon',false)",
    "('Cold Evidence','cold-evidence','A forensic detective uses DNA technology to solve a cold case.','Detective Sarah Chen specializes in cold cases.','/images/movies/cold-evidence.jpg','/images/movies/cold-evidence.jpg','Thriller','English',128,'R',7.7,'2025-03-22','David Fincher','[\"Rooney Mara\",\"Michael B. Jordan\",\"Gary Oldman\"]','now_showing',false)",
    "('Starlight Rescue','starlight-rescue','A small robot journeys across a magical forest.','When inventor Dr. Lin disappears, her robot companion Spark ventures into the enchanted forest.','/images/movies/starlight-rescue.jpg','/images/movies/starlight-rescue.jpg','Animation','English',95,'PG',8.3,'2025-06-20','Pete Docter','[\"Tom Holland\",\"Zendaya\",\"Morgan Freeman\"]','coming_soon',true)",
    "('Iron Fist Legacy','iron-fist-legacy','A martial artist trains in ancient techniques.','After her grandfather is attacked, Mei Chen discovers she is heir to the Iron Fist.','/images/movies/iron-fist-legacy.jpg','/images/movies/iron-fist-legacy.jpg','Action','English',138,'PG-13',7.4,'2025-04-25','Chad Stahelski','[\"Simu Liu\",\"Michelle Yeoh\",\"Donnie Yen\"]','coming_soon',false)",
    "('Mind Maze','mind-maze','A neuroscientist enters patients subconscious minds.','Dr. Rachel Kim has pioneered a revolutionary therapy.','/images/movies/mind-maze.jpg','/images/movies/mind-maze.jpg','Drama','English',115,'PG-13',7.8,'2025-05-30','Darren Aronofsky','[\"Natalie Portman\",\"Adam Driver\",\"Jessica Chastain\"]','coming_soon',false)",
    "('Midnight Symphony','midnight-symphony','A struggling orchestra finds inspiration.','The Metropolitan Symphony Orchestra is on the verge of bankruptcy.','/images/movies/midnight-symphony.jpg','/images/movies/midnight-symphony.jpg','Musical','English',130,'PG',8.2,'2025-06-15','Damien Chazelle','[\"Rami Malek\",\"Taron Egerton\",\"Meryl Streep\"]','coming_soon',false)",
  ].join(",");

  const movieSql = `INSERT INTO movies (title, slug, description, synopsis, poster_url, banner_url, genre, language, duration, rating, imdb_rating, release_date, director, cast, status, is_featured) VALUES ${movieValues}`;
  await conn.execute(movieSql);
  console.log("Inserted 11 movies");

  // Insert theaters
  const theaterValues = [
    "('CineMax Grand','New York','123 Broadway Ave, New York, NY 10001','[\"IMAX\",\"Dolby Atmos\",\"Recliner Seats\",\"VIP Lounge\"]',true)",
    "('Starlight Cinema','Los Angeles','456 Hollywood Blvd, Los Angeles, CA 90028','[\"4DX\",\"ScreenX\",\"Bar & Kitchen\",\"Parking\"]',true)",
    "('Empire Theaters','Chicago','789 Michigan Ave, Chicago, IL 60611','[\"IMAX\",\"D-Box\",\"Concession Stand\",\"Wheelchair Access\"]',true)",
    "('Premiere Cinema','Miami','321 Ocean Drive, Miami, FL 33139','[\"Dolby Atmos\",\"VIP Lounge\",\"Valet Parking\",\"Bar\"]',true)",
    "('Royal Cinemas','San Francisco','654 Market St, San Francisco, CA 94105','[\"IMAX\",\"Recliner Seats\",\"Snack Bar\",\"Free WiFi\"]',true)",
    "('Grandview Theater','New York','987 5th Ave, New York, NY 10021','[\"ScreenX\",\"Bar & Kitchen\",\"Valet\",\"Lounge\"]',true)",
  ].join(",");

  await conn.execute(`INSERT INTO theaters (name, city, address, amenities, is_active) VALUES ${theaterValues}`);
  console.log("Inserted 6 theaters");

  // Insert shows - simplified, just 12 shows
  const showValues = [
    "(1,1,'2025-06-09','10:00','Screen 1','2D',12.00,17.00,22.00,true)",
    "(1,1,'2025-06-09','13:30','Screen 2','3D',16.00,21.00,26.00,true)",
    "(1,1,'2025-06-09','19:30','Screen 1','IMAX',22.00,27.00,32.00,true)",
    "(1,2,'2025-06-09','10:00','Screen 1','2D',12.00,17.00,22.00,true)",
    "(2,1,'2025-06-09','16:45','Screen 3','2D',12.00,17.00,22.00,true)",
    "(2,3,'2025-06-09','19:30','Screen 1','IMAX',22.00,27.00,32.00,true)",
    "(3,1,'2025-06-09','13:30','Screen 2','2D',12.00,17.00,22.00,true)",
    "(3,4,'2025-06-09','19:30','Screen 1','3D',16.00,21.00,26.00,true)",
    "(4,2,'2025-06-09','22:15','Screen 3','2D',12.00,17.00,22.00,true)",
    "(5,1,'2025-06-09','10:00','Screen 1','IMAX',22.00,27.00,32.00,true)",
    "(7,5,'2025-06-09','16:45','Screen 2','2D',12.00,17.00,22.00,true)",
    "(1,1,'2025-06-10','19:30','Screen 1','3D',16.00,21.00,26.00,true)",
  ].join(",");

  await conn.execute(`INSERT INTO shows (movie_id, theater_id, show_date, show_time, screen_name, format, price_silver, price_gold, price_premium, is_active) VALUES ${showValues}`);
  console.log("Inserted 12 shows");

  // Insert seats using bulk insert - generate values
  const sectionMap: Record<string, string[]> = {
    silver: ["A","B","C"],
    gold: ["D","E","F"],
    premium: ["G","H"],
  };

  const seatValues: string[] = [];
  for (let showId = 1; showId <= 12; showId++) {
    for (const [section, rows] of Object.entries(sectionMap)) {
      for (const row of rows) {
        for (let col = 1; col <= 10; col++) {
          const status = Math.random() > 0.75 ? "booked" : "available";
          seatValues.push(`(${showId},'${row}${col}','${section}','${row}',${col},'${status}')`);
        }
      }
    }
  }

  // Insert in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < seatValues.length; i += chunkSize) {
    const chunk = seatValues.slice(i, i + chunkSize);
    await conn.execute(`INSERT INTO seats (show_id, seat_number, section, row_label, col_num, status) VALUES ${chunk.join(",")}`);
  }
  console.log(`Inserted ${seatValues.length} seats`);

  await conn.end();
  console.log("Seed complete!");
}

seed().catch(console.error);
