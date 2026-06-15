// @ts-nocheck
import { getDb } from "../server/queries/connection";
import { movies, theaters, shows } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const movieData = [
    { title: "NEBULA", slug: "nebula", description: "A lone astronaut discovers an ancient cosmic entity that holds the key to humanity's survival beyond the stars.", synopsis: "When astronaut Dr. Elena Vasquez ventures beyond the edge of our solar system on a solo mission, she encounters a sentient nebula that reveals the interconnected destiny of all conscious beings.", posterUrl: "/images/movies/nebula.jpg", bannerUrl: "/images/movies/nebula.jpg", genre: "Sci-Fi", language: "English", duration: 148, rating: "PG-13", imdbRating: "8.4", releaseDate: "2025-01-15", director: "Christopher Nolan", cast: '["Ana de Armas","Oscar Isaac","Benedict Cumberbatch"]', status: "now_showing" as const, isFeatured: true },
    { title: "Shadow Protocol", slug: "shadow-protocol", description: "An elite operative uncovers a conspiracy that reaches the highest levels of government.", synopsis: "Former intelligence agent Kira Tanaka is pulled back into the shadows when a routine extraction reveals a decades-old conspiracy involving global surveillance and an AI.", posterUrl: "/images/movies/shadow-protocol.jpg", bannerUrl: "/images/movies/shadow-protocol.jpg", genre: "Action", language: "English", duration: 132, rating: "R", imdbRating: "7.9", releaseDate: "2025-02-20", director: "Denis Villeneuve", cast: '["Florence Pugh","Timothee Chalamet","Idris Elba"]', status: "now_showing" as const, isFeatured: true },
    { title: "Eternal Waltz", slug: "eternal-waltz", description: "Two star-crossed lovers discover their connection transcends time itself.", synopsis: "In 1920s Vienna, a composer and a ballerina fall in love, only to be torn apart by war. Ninety years later, they experience vivid dreams of this past life.", posterUrl: "/images/movies/eternal-waltz.jpg", bannerUrl: "/images/movies/eternal-waltz.jpg", genre: "Romance", language: "English", duration: 125, rating: "PG", imdbRating: "8.1", releaseDate: "2025-02-14", director: "Sofia Coppola", cast: '["Saoirse Ronan","Paul Mescal","Tilda Swinton"]', status: "now_showing" as const, isFeatured: true },
    { title: "Whispering Halls", slug: "whispering-halls", description: "A paranormal investigator confronts the spirits of a Victorian mansion.", synopsis: "Paranormal psychologist Dr. Marcus Hale accepts what seems like a routine case at Blackwood Manor.", posterUrl: "/images/movies/whispering-halls.jpg", bannerUrl: "/images/movies/whispering-halls.jpg", genre: "Horror", language: "English", duration: 118, rating: "R", imdbRating: "7.5", releaseDate: "2025-03-01", director: "Ari Aster", cast: '["Joaquin Phoenix","Anya Taylor-Joy","Willem Dafoe"]', status: "now_showing" as const, isFeatured: false },
    { title: "Dragon's Crest", slug: "dragons-crest", description: "A young blacksmith discovers she is the last dragon rider.", synopsis: "In the fractured kingdom of Aldoria, blacksmith's apprentice Maren discovers an ancient dragon egg hidden beneath her village.", posterUrl: "/images/movies/dragons-crest.jpg", bannerUrl: "/images/movies/dragons-crest.jpg", genre: "Fantasy", language: "English", duration: 155, rating: "PG-13", imdbRating: "8.0", releaseDate: "2025-04-10", director: "Peter Jackson", cast: '["Millie Bobby Brown","Henry Cavill","Helen Mirren"]', status: "coming_soon" as const, isFeatured: true },
    { title: "The Weekend Escape", slug: "weekend-escape", description: "Four friends' luxury weekend getaway turns into hilarious misadventures.", synopsis: "When four college friends reunite for a luxury weekend at a coastal villa, nothing goes as planned.", posterUrl: "/images/movies/weekend-escape.jpg", bannerUrl: "/images/movies/weekend-escape.jpg", genre: "Comedy", language: "English", duration: 105, rating: "PG-13", imdbRating: "7.2", releaseDate: "2025-05-15", director: "Greta Gerwig", cast: '["Jennifer Lawrence","Ryan Reynolds","Awkwafina"]', status: "coming_soon" as const, isFeatured: false },
    { title: "Cold Evidence", slug: "cold-evidence", description: "A forensic detective uses cutting-edge DNA technology to solve a cold case.", synopsis: "Detective Sarah Chen specializes in cold cases that others have given up on.", posterUrl: "/images/movies/cold-evidence.jpg", bannerUrl: "/images/movies/cold-evidence.jpg", genre: "Thriller", language: "English", duration: 128, rating: "R", imdbRating: "7.7", releaseDate: "2025-03-22", director: "David Fincher", cast: '["Rooney Mara","Michael B. Jordan","Gary Oldman"]', status: "now_showing" as const, isFeatured: false },
    { title: "Starlight Rescue", slug: "starlight-rescue", description: "A small robot must journey across a magical forest to save its creator.", synopsis: "When inventor Dr. Lin disappears, her tiny robot companion Spark must venture into the enchanted Whisperwood Forest.", posterUrl: "/images/movies/starlight-rescue.jpg", bannerUrl: "/images/movies/starlight-rescue.jpg", genre: "Animation", language: "English", duration: 95, rating: "PG", imdbRating: "8.3", releaseDate: "2025-06-20", director: "Pete Docter", cast: '["Tom Holland","Zendaya","Morgan Freeman"]', status: "coming_soon" as const, isFeatured: true },
    { title: "Iron Fist Legacy", slug: "iron-fist-legacy", description: "A modern martial artist trains in ancient techniques.", synopsis: "After her grandfather is attacked, martial arts instructor Mei Chen discovers she is the heir to the Iron Fist technique.", posterUrl: "/images/movies/iron-fist-legacy.jpg", bannerUrl: "/images/movies/iron-fist-legacy.jpg", genre: "Action", language: "English", duration: 138, rating: "PG-13", imdbRating: "7.4", releaseDate: "2025-04-25", director: "Chad Stahelski", cast: '["Simu Liu","Michelle Yeoh","Donnie Yen"]', status: "coming_soon" as const, isFeatured: false },
    { title: "Mind Maze", slug: "mind-maze", description: "A neuroscientist enters patients' subconscious minds to treat trauma.", synopsis: "Dr. Rachel Kim has pioneered a revolutionary therapy that allows her to enter patients' subconscious minds.", posterUrl: "/images/movies/mind-maze.jpg", bannerUrl: "/images/movies/mind-maze.jpg", genre: "Drama", language: "English", duration: 115, rating: "PG-13", imdbRating: "7.8", releaseDate: "2025-05-30", director: "Darren Aronofsky", cast: '["Natalie Portman","Adam Driver","Jessica Chastain"]', status: "coming_soon" as const, isFeatured: false },
    { title: "Midnight Symphony", slug: "midnight-symphony", description: "A struggling orchestra finds inspiration from an unlikely source.", synopsis: "The Metropolitan Symphony Orchestra is on the verge of bankruptcy when maestro Viktor Orlov takes a chance on a homeless prodigy.", posterUrl: "/images/movies/midnight-symphony.jpg", bannerUrl: "/images/movies/midnight-symphony.jpg", genre: "Musical", language: "English", duration: 130, rating: "PG", imdbRating: "8.2", releaseDate: "2025-06-15", director: "Damien Chazelle", cast: '["Rami Malek","Taron Egerton","Meryl Streep"]', status: "coming_soon" as const, isFeatured: false },
  ];

  await db.insert(movies).values(movieData);
  console.log(`Inserted ${movieData.length} movies`);

  const theaterData = [
    { name: "CineMax Grand", city: "New York", address: "123 Broadway Ave, New York, NY 10001", amenities: '["IMAX","Dolby Atmos","Recliner Seats","VIP Lounge"]', isActive: true },
    { name: "Starlight Cinema", city: "Los Angeles", address: "456 Hollywood Blvd, Los Angeles, CA 90028", amenities: '["4DX","ScreenX","Bar & Kitchen","Parking"]', isActive: true },
    { name: "Empire Theaters", city: "Chicago", address: "789 Michigan Ave, Chicago, IL 60611", amenities: '["IMAX","D-Box","Concession Stand","Wheelchair Access"]', isActive: true },
    { name: "Premiere Cinema", city: "Miami", address: "321 Ocean Drive, Miami, FL 33139", amenities: '["Dolby Atmos","VIP Lounge","Valet Parking","Bar"]', isActive: true },
    { name: "Royal Cinemas", city: "San Francisco", address: "654 Market St, San Francisco, CA 94105", amenities: '["IMAX","Recliner Seats","Snack Bar","Free WiFi"]', isActive: true },
    { name: "Grandview Theater", city: "New York", address: "987 5th Ave, New York, NY 10021", amenities: '["ScreenX","Bar & Kitchen","Valet","Lounge"]', isActive: true },
  ];

  await db.insert(theaters).values(theaterData);
  console.log(`Inserted ${theaterData.length} theaters`);

  const showTimes = ["10:00", "13:30", "16:45", "19:30", "22:15"];
  const screens = ["Screen 1", "Screen 2", "Screen 3"];
  const formats = ["2D", "3D", "IMAX"];
  const today = new Date();
  const showData = [];

  for (let movieIdx = 0; movieIdx < 5; movieIdx++) {
    for (let theaterIdx = 0; theaterIdx < 4; theaterIdx++) {
      for (let day = 0; day < 3; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split("T")[0];
        for (let s = 0; s < 3; s++) {
          const format = formats[s % formats.length];
          const basePrice = format === "IMAX" ? 22 : format === "3D" ? 16 : 12;
          showData.push({ movieId: movieIdx + 1, theaterId: theaterIdx + 1, showDate: dateStr, showTime: showTimes[s], screenName: screens[s], format: format as "2D" | "3D" | "IMAX" | "4DX", priceSilver: String(basePrice), priceGold: String(basePrice + 5), pricePremium: String(basePrice + 10), isActive: true });
        }
      }
    }
  }

  await db.insert(shows).values(showData);
  console.log(`Inserted ${showData.length} shows`);

  // Use raw SQL for efficient seat insertion
  const rows = ["A","B","C","D","E","F","G","H"];
  const sectionMap: Record<string, string[]> = { silver: ["A","B","C"], gold: ["D","E","F"], premium: ["G","H"] };
  
  let values: string[] = [];
  for (let showIdx = 1; showIdx <= showData.length; showIdx++) {
    for (const [section, rowList] of Object.entries(sectionMap)) {
      for (const row of rowList) {
        for (let col = 1; col <= 10; col++) {
          const status = Math.random() > 0.75 ? "booked" : "available";
          values.push(`(${showIdx}, '${row}${col}', '${section}', '${row}', ${col}, '${status}')`);
        }
      }
    }
  }

  // Insert in chunks of 5000
  const chunkSize = 5000;
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    const query = `INSERT INTO seats (show_id, seat_number, section, row_label, col_num, status) VALUES ${chunk.join(", ")}`;
    await db.execute(sql.raw(query));
  }
  console.log(`Inserted ${values.length} seats`);

  console.log("Seed complete!");
}

seed().catch(console.error);
