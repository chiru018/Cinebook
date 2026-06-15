import { z } from "zod";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { movies } from "@db/schema";

export const movieRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.enum(["now_showing", "coming_soon", "ended"]).optional(),
        genre: z.string().optional(),
        language: z.string().optional(),
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { status, genre, language, search, page = 1, limit = 12 } = input || {};

      const conditions = [];
      if (status) conditions.push(eq(movies.status, status));
      if (genre) conditions.push(like(movies.genre, `%${genre}%`));
      if (language) conditions.push(eq(movies.language, language));
      if (search) conditions.push(like(movies.title, `%${search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(movies)
          .where(where)
          .orderBy(desc(movies.isFeatured), desc(movies.releaseDate))
          .limit(limit)
          .offset((page - 1) * limit),
        db
          .select({ count: sql<number>`count(*)` })
          .from(movies)
          .where(where),
      ]);

      return {
        movies: data,
        total: countResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(movies)
      .where(eq(movies.isFeatured, true))
      .orderBy(desc(movies.releaseDate))
      .limit(6);
  }),

  nowShowing: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(movies)
      .where(eq(movies.status, "now_showing"))
      .orderBy(desc(movies.imdbRating))
      .limit(12);
  }),

  comingSoon: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(movies)
      .where(eq(movies.status, "coming_soon"))
      .orderBy(movies.releaseDate)
      .limit(12);
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(movies)
        .where(eq(movies.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(movies)
        .where(eq(movies.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  genres: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .selectDistinct({ genre: movies.genre })
      .from(movies);
    return result.map((r) => r.genre);
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        synopsis: z.string().optional(),
        posterUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        trailerUrl: z.string().optional(),
        genre: z.string().min(1),
        language: z.string().min(1),
        duration: z.number().min(1),
        rating: z.string().min(1),
        imdbRating: z.string().optional(),
        releaseDate: z.string(),
        director: z.string().optional(),
        cast: z.array(z.string()).optional(),
        status: z.enum(["now_showing", "coming_soon", "ended"]),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { cast, releaseDate, ...rest } = input;
      const result = await db.insert(movies).values({
        ...rest,
        releaseDate: new Date(releaseDate),
        cast: cast as never,
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        synopsis: z.string().optional(),
        posterUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        genre: z.string().optional(),
        language: z.string().optional(),
        duration: z.number().optional(),
        rating: z.string().optional(),
        imdbRating: z.string().optional(),
        releaseDate: z.string().optional(),
        director: z.string().optional(),
        cast: z.array(z.string()).optional(),
        status: z.enum(["now_showing", "coming_soon", "ended"]).optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, releaseDate, cast, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (releaseDate) updateData.releaseDate = new Date(releaseDate);
      if (cast) updateData.cast = cast as never;
      await db.update(movies).set(updateData as never).where(eq(movies.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(movies).where(eq(movies.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const [total, nowShowing, comingSoon, featured] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(movies),
      db.select({ count: sql<number>`count(*)` }).from(movies).where(eq(movies.status, "now_showing")),
      db.select({ count: sql<number>`count(*)` }).from(movies).where(eq(movies.status, "coming_soon")),
      db.select({ count: sql<number>`count(*)` }).from(movies).where(eq(movies.isFeatured, true)),
    ]);
    return {
      total: total[0]?.count ?? 0,
      nowShowing: nowShowing[0]?.count ?? 0,
      comingSoon: comingSoon[0]?.count ?? 0,
      featured: featured[0]?.count ?? 0,
    };
  }),
});
