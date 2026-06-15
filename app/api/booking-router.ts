import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings, shows, movies, theaters } from "@db/schema";

export const bookingRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        showId: z.number(),
        movieId: z.number(),
        theaterId: z.number(),
        seatNumbers: z.array(z.string()),
        totalAmount: z.string(),
        convenienceFee: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const result = await db.insert(bookings).values({
        userId,
        showId: input.showId,
        movieId: input.movieId,
        theaterId: input.theaterId,
        seatNumbers: input.seatNumbers,
        totalAmount: input.totalAmount,
        convenienceFee: input.convenienceFee ?? "2.00",
        status: "confirmed",
      });

      return { success: true, bookingId: Number(result[0].insertId) };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const bookingList = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.bookingDate));

    // Enrich with movie and theater info
    const enriched = [];
    for (const booking of bookingList) {
      const [movie] = await db
        .select({ title: movies.title, posterUrl: movies.posterUrl, slug: movies.slug })
        .from(movies)
        .where(eq(movies.id, booking.movieId))
        .limit(1);
      const [theater] = await db
        .select({ name: theaters.name, city: theaters.city })
        .from(theaters)
        .where(eq(theaters.id, booking.theaterId))
        .limit(1);
      const [show] = await db
        .select({ showDate: shows.showDate, showTime: shows.showTime, screenName: shows.screenName, format: shows.format })
        .from(shows)
        .where(eq(shows.id, booking.showId))
        .limit(1);

      enriched.push({
        ...booking,
        movieTitle: movie?.title ?? "Unknown",
        moviePoster: movie?.posterUrl ?? "",
        movieSlug: movie?.slug ?? "",
        theaterName: theater?.name ?? "Unknown",
        theaterCity: theater?.city ?? "Unknown",
        showDate: show?.showDate ?? "",
        showTime: show?.showTime ?? "",
        screenName: show?.screenName ?? "",
        format: show?.format ?? "2D",
      });
    }

    return enriched;
  }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const [booking] = await db
        .select()
        .from(bookings)
        .where(and(eq(bookings.id, input.id), eq(bookings.userId, ctx.user.id)))
        .limit(1);

      if (!booking) return null;

      const [movie] = await db
        .select({ title: movies.title, posterUrl: movies.posterUrl, slug: movies.slug })
        .from(movies)
        .where(eq(movies.id, booking.movieId))
        .limit(1);
      const [theater] = await db
        .select({ name: theaters.name, city: theaters.city, address: theaters.address })
        .from(theaters)
        .where(eq(theaters.id, booking.theaterId))
        .limit(1);
      const [show] = await db
        .select({ showDate: shows.showDate, showTime: shows.showTime, screenName: shows.screenName, format: shows.format })
        .from(shows)
        .where(eq(shows.id, booking.showId))
        .limit(1);

      return {
        ...booking,
        movieTitle: movie?.title ?? "Unknown",
        moviePoster: movie?.posterUrl ?? "",
        movieSlug: movie?.slug ?? "",
        theaterName: theater?.name ?? "Unknown",
        theaterCity: theater?.city ?? "Unknown",
        theaterAddress: theater?.address ?? "",
        showDate: show?.showDate ?? "",
        showTime: show?.showTime ?? "",
        screenName: show?.screenName ?? "",
        format: show?.format ?? "2D",
      };
    }),

  cancel: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(and(eq(bookings.id, input.id), eq(bookings.userId, ctx.user.id)));
      return { success: true };
    }),

  // Admin endpoints
  adminList: adminQuery
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        status: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { page = 1, limit = 20, status } = input || {};

      let query = db.select().from(bookings);
      if (status) {
        query = query.where(eq(bookings.status, status as "pending" | "confirmed" | "cancelled" | "refunded")) as typeof query;
      }

      const data = await query
        .orderBy(desc(bookings.bookingDate))
        .limit(limit)
        .offset((page - 1) * limit);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(bookings);

      return {
        bookings: data,
        total: countResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const [total, confirmed, pending, cancelled, revenue] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(bookings),
      db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "confirmed")),
      db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "cancelled")),
      db.select({ total: sql<string>`COALESCE(SUM(total_amount), 0)` }).from(bookings).where(eq(bookings.status, "confirmed")),
    ]);

    return {
      total: total[0]?.count ?? 0,
      confirmed: confirmed[0]?.count ?? 0,
      pending: pending[0]?.count ?? 0,
      cancelled: cancelled[0]?.count ?? 0,
      revenue: Number(revenue[0]?.total ?? 0),
    };
  }),
});
