import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  date,
  decimal,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (required for auth, DO NOT modify) ───────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Movies ───────────────────────────────────────────────────────────────
export const movies = mysqlTable("movies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  synopsis: text("synopsis"),
  posterUrl: varchar("poster_url", { length: 500 }),
  bannerUrl: varchar("banner_url", { length: 500 }),
  trailerUrl: varchar("trailer_url", { length: 500 }),
  genre: varchar("genre", { length: 255 }).notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  duration: int("duration").notNull(),
  rating: varchar("rating", { length: 20 }).notNull(),
  imdbRating: decimal("imdb_rating", { precision: 3, scale: 1 }),
  releaseDate: date("release_date").notNull(),
  director: varchar("director", { length: 255 }),
  cast: json("cast").$type<string[]>(),
  status: mysqlEnum("status", ["now_showing", "coming_soon", "ended"]).default("coming_soon").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = typeof movies.$inferInsert;

// ─── Theaters ─────────────────────────────────────────────────────────────
export const theaters = mysqlTable("theaters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address"),
  amenities: json("amenities").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Theater = typeof theaters.$inferSelect;
export type InsertTheater = typeof theaters.$inferInsert;

// ─── Shows ────────────────────────────────────────────────────────────────
export const shows = mysqlTable("shows", {
  id: serial("id").primaryKey(),
  movieId: bigint("movie_id", { mode: "number", unsigned: true }).notNull(),
  theaterId: bigint("theater_id", { mode: "number", unsigned: true }).notNull(),
  showDate: date("show_date").notNull(),
  showTime: varchar("show_time", { length: 10 }).notNull(),
  screenName: varchar("screen_name", { length: 100 }).notNull(),
  format: mysqlEnum("format", ["2D", "3D", "IMAX", "4DX"]).default("2D").notNull(),
  priceSilver: decimal("price_silver", { precision: 6, scale: 2 }).notNull(),
  priceGold: decimal("price_gold", { precision: 6, scale: 2 }).notNull(),
  pricePremium: decimal("price_premium", { precision: 6, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Show = typeof shows.$inferSelect;
export type InsertShow = typeof shows.$inferInsert;

// ─── Seats ────────────────────────────────────────────────────────────────
export const seats = mysqlTable("seats", {
  id: serial("id").primaryKey(),
  showId: bigint("show_id", { mode: "number", unsigned: true }).notNull(),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  section: mysqlEnum("section", ["silver", "gold", "premium"]).notNull(),
  rowLabel: varchar("row_label", { length: 5 }).notNull(),
  colNum: int("col_num").notNull(),
  status: mysqlEnum("status", ["available", "booked", "reserved"]).default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Seat = typeof seats.$inferSelect;
export type InsertSeat = typeof seats.$inferInsert;

// ─── Bookings ─────────────────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  showId: bigint("show_id", { mode: "number", unsigned: true }).notNull(),
  movieId: bigint("movie_id", { mode: "number", unsigned: true }).notNull(),
  theaterId: bigint("theater_id", { mode: "number", unsigned: true }).notNull(),
  seatNumbers: json("seat_numbers").$type<string[]>().notNull(),
  totalAmount: decimal("total_amount", { precision: 8, scale: 2 }).notNull(),
  convenienceFee: decimal("convenience_fee", { precision: 6, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "refunded"]).default("pending").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ─── Reviews ──────────────────────────────────────────────────────────────
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  movieId: bigint("movie_id", { mode: "number", unsigned: true }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ─── Saved Movies ─────────────────────────────────────────────────────────
export const savedMovies = mysqlTable("saved_movies", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  movieId: bigint("movie_id", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SavedMovie = typeof savedMovies.$inferSelect;
export type InsertSavedMovie = typeof savedMovies.$inferInsert;
