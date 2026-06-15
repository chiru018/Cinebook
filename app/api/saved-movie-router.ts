import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { savedMovies, movies } from "@db/schema";

export const savedMovieRouter = createRouter({
  toggle: authedQuery
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const existing = await db
        .select()
        .from(savedMovies)
        .where(
          and(
            eq(savedMovies.userId, userId),
            eq(savedMovies.movieId, input.movieId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .delete(savedMovies)
          .where(eq(savedMovies.id, existing[0].id));
        return { saved: false };
      } else {
        await db.insert(savedMovies).values({
          userId,
          movieId: input.movieId,
        });
        return { saved: true };
      }
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const saved = await db
      .select()
      .from(savedMovies)
      .where(eq(savedMovies.userId, ctx.user.id))
      .orderBy(savedMovies.createdAt);

    const enriched = [];
    for (const s of saved) {
      const [movie] = await db
        .select()
        .from(movies)
        .where(eq(movies.id, s.movieId))
        .limit(1);
      if (movie) {
        enriched.push({ ...movie, savedAt: s.createdAt });
      }
    }

    return enriched;
  }),

  check: authedQuery
    .input(z.object({ movieId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(savedMovies)
        .where(
          and(
            eq(savedMovies.userId, ctx.user.id),
            eq(savedMovies.movieId, input.movieId)
          )
        )
        .limit(1);
      return existing.length > 0;
    }),
});
