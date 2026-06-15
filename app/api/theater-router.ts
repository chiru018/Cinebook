import { z } from "zod";
import { eq, like } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { theaters } from "@db/schema";

export const theaterRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        city: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { city, search } = input || {};

      let query = db.select().from(theaters);

      if (city) {
        query = query.where(eq(theaters.city, city)) as typeof query;
      }

      if (search) {
        query = query.where(like(theaters.name, `%${search}%`)) as typeof query;
      }

      return query;
    }),

  cities: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .selectDistinct({ city: theaters.city })
      .from(theaters)
      .where(eq(theaters.isActive, true));
    return result.map((r) => r.city).sort();
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(theaters)
        .where(eq(theaters.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        city: z.string().min(1),
        address: z.string().optional(),
        amenities: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(theaters).values({
        ...input,
        amenities: input.amenities ?? [],
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        amenities: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(theaters).set(data).where(eq(theaters.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(theaters).where(eq(theaters.id, input.id));
      return { success: true };
    }),
});
