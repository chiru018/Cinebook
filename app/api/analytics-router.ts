import { sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings, movies, theaters, users } from "@db/schema";

export const analyticsRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      totalMovies,
      totalTheaters,
      confirmedBookings,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(bookings),
      db
        .select({ total: sql<string>`COALESCE(SUM(total_amount), 0)` })
        .from(bookings)
        .where(sql`${bookings.status} = 'confirmed'`),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(movies),
      db.select({ count: sql<number>`count(*)` }).from(theaters),
      db
        .select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(sql`${bookings.status} = 'confirmed'`),
    ]);

    return {
      totalBookings: totalBookings[0]?.count ?? 0,
      totalRevenue: Number(totalRevenue[0]?.total ?? 0),
      totalUsers: totalUsers[0]?.count ?? 0,
      totalMovies: totalMovies[0]?.count ?? 0,
      totalTheaters: totalTheaters[0]?.count ?? 0,
      confirmedBookings: confirmedBookings[0]?.count ?? 0,
    };
  }),

  weeklyRevenue: adminQuery.query(async () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const data = weeks.map((week) => ({
      week,
      revenue: Math.floor(5000 + Math.random() * 15000),
      bookings: Math.floor(50 + Math.random() * 200),
    }));
    return data;
  }),

  popularMovies: adminQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({
        movieId: bookings.movieId,
        bookingCount: sql<number>`count(*)`,
      })
      .from(bookings)
      .groupBy(bookings.movieId)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    const enriched = [];
    for (const row of result) {
      const [movie] = await db
        .select({ title: movies.title, posterUrl: movies.posterUrl })
        .from(movies)
        .where(sql`${movies.id} = ${row.movieId}`)
        .limit(1);
      enriched.push({
        movieId: row.movieId,
        title: movie?.title ?? "Unknown",
        posterUrl: movie?.posterUrl ?? "",
        bookings: row.bookingCount,
      });
    }

    return enriched;
  }),

  theaterPerformance: adminQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({
        theaterId: bookings.theaterId,
        bookingCount: sql<number>`count(*)`,
        revenue: sql<string>`COALESCE(SUM(total_amount), 0)`,
      })
      .from(bookings)
      .groupBy(bookings.theaterId)
      .orderBy(sql`count(*) DESC`);

    const enriched = [];
    for (const row of result) {
      const [theater] = await db
        .select({ name: theaters.name, city: theaters.city })
        .from(theaters)
        .where(sql`${theaters.id} = ${row.theaterId}`)
        .limit(1);
      enriched.push({
        theaterId: row.theaterId,
        name: theater?.name ?? "Unknown",
        city: theater?.city ?? "Unknown",
        bookings: row.bookingCount,
        revenue: Number(row.revenue),
      });
    }

    return enriched;
  }),
});
