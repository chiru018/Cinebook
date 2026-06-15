import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { shows, movies, theaters } from "@db/schema";

export const showRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        movieId: z.number().optional(),
        theaterId: z.number().optional(),
        date: z.string().optional(),
        city: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(shows.isActive, true)];

      if (input.movieId) conditions.push(eq(shows.movieId, input.movieId));
      if (input.theaterId) conditions.push(eq(shows.theaterId, input.theaterId));
      if (input.date) conditions.push(sql`${shows.showDate} = ${input.date}`);

      const where = and(...conditions);

      const showList = await db
        .select({
          id: shows.id,
          movieId: shows.movieId,
          theaterId: shows.theaterId,
          showDate: shows.showDate,
          showTime: shows.showTime,
          screenName: shows.screenName,
          format: shows.format,
          priceSilver: shows.priceSilver,
          priceGold: shows.priceGold,
          pricePremium: shows.pricePremium,
        })
        .from(shows)
        .where(where);

      // Enrich with movie and theater names
      const enriched = [];
      for (const show of showList) {
        const [movie] = await db
          .select({ title: movies.title, posterUrl: movies.posterUrl, duration: movies.duration })
          .from(movies)
          .where(eq(movies.id, show.movieId))
          .limit(1);
        const [theater] = await db
          .select({ name: theaters.name, city: theaters.city })
          .from(theaters)
          .where(eq(theaters.id, show.theaterId))
          .limit(1);

        if (input.city && theater && theater.city !== input.city) continue;

        enriched.push({
          ...show,
          movieTitle: movie?.title ?? "Unknown",
          moviePoster: movie?.posterUrl ?? "",
          movieDuration: movie?.duration ?? 0,
          theaterName: theater?.name ?? "Unknown",
          theaterCity: theater?.city ?? "Unknown",
        });
      }

      return enriched;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [show] = await db
        .select()
        .from(shows)
        .where(eq(shows.id, input.id))
        .limit(1);

      if (!show) return null;

      const [movie] = await db
        .select({ title: movies.title, posterUrl: movies.posterUrl, duration: movies.duration, slug: movies.slug })
        .from(movies)
        .where(eq(movies.id, show.movieId))
        .limit(1);
      const [theater] = await db
        .select({ name: theaters.name, city: theaters.city, address: theaters.address })
        .from(theaters)
        .where(eq(theaters.id, show.theaterId))
        .limit(1);

      return {
        ...show,
        movieTitle: movie?.title ?? "Unknown",
        moviePoster: movie?.posterUrl ?? "",
        movieDuration: movie?.duration ?? 0,
        movieSlug: movie?.slug ?? "",
        theaterName: theater?.name ?? "Unknown",
        theaterCity: theater?.city ?? "Unknown",
        theaterAddress: theater?.address ?? "",
      };
    }),

  times: publicQuery
    .input(
      z.object({
        movieId: z.number(),
        theaterId: z.number().optional(),
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [
        eq(shows.movieId, input.movieId),
        sql`${shows.showDate} = ${input.date}`,
        eq(shows.isActive, true),
      ];
      if (input.theaterId) conditions.push(eq(shows.theaterId, input.theaterId));

      return db
        .select({
          id: shows.id,
          showTime: shows.showTime,
          screenName: shows.screenName,
          format: shows.format,
          priceSilver: shows.priceSilver,
          priceGold: shows.priceGold,
          pricePremium: shows.pricePremium,
          theaterId: shows.theaterId,
        })
        .from(shows)
        .where(and(...conditions))
        .orderBy(shows.showTime);
    }),

  create: adminQuery
    .input(
      z.object({
        movieId: z.number(),
        theaterId: z.number(),
        showDate: z.string(),
        showTime: z.string(),
        screenName: z.string(),
        format: z.enum(["2D", "3D", "IMAX", "4DX"]).default("2D"),
        priceSilver: z.string(),
        priceGold: z.string(),
        pricePremium: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { showDate, ...rest } = input;
      return db.insert(shows).values({
        ...rest,
        showDate: new Date(showDate),
      });
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        showDate: z.string().optional(),
        showTime: z.string().optional(),
        screenName: z.string().optional(),
        format: z.enum(["2D", "3D", "IMAX", "4DX"]).optional(),
        priceSilver: z.string().optional(),
        priceGold: z.string().optional(),
        pricePremium: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, showDate, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (showDate) updateData.showDate = new Date(showDate);
      await db.update(shows).set(updateData as never).where(eq(shows.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(shows).where(eq(shows.id, input.id));
      return { success: true };
    }),
});
