import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews, users } from "@db/schema";

export const reviewRouter = createRouter({
  list: publicQuery
    .input(z.object({ movieId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const reviewList = await db
        .select()
        .from(reviews)
        .where(eq(reviews.movieId, input.movieId))
        .orderBy(desc(reviews.createdAt));

      // Enrich with user info
      const enriched = [];
      for (const review of reviewList) {
        const [user] = await db
          .select({ name: users.name, avatar: users.avatar })
          .from(users)
          .where(eq(users.id, review.userId))
          .limit(1);

        enriched.push({
          ...review,
          userName: user?.name ?? "Anonymous",
          userAvatar: user?.avatar ?? "",
        });
      }

      return enriched;
    }),

  create: authedQuery
    .input(
      z.object({
        movieId: z.number(),
        rating: z.number().min(1).max(10),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const result = await db.insert(reviews).values({
        userId,
        movieId: input.movieId,
        rating: input.rating,
        comment: input.comment ?? "",
      });

      return { success: true, reviewId: Number(result[0].insertId) };
    }),

  myReviews: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, ctx.user.id))
      .orderBy(desc(reviews.createdAt));
  }),

  averageRating: publicQuery
    .input(z.object({ movieId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({ avg: sql<number>`COALESCE(AVG(rating), 0)` })
        .from(reviews)
        .where(eq(reviews.movieId, input.movieId));
      return result[0]?.avg ?? 0;
    }),
});
