import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seats } from "@db/schema";

export const seatRouter = createRouter({
  byShow: publicQuery
    .input(z.object({ showId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(seats)
        .where(eq(seats.showId, input.showId))
        .orderBy(seats.rowLabel, seats.colNum);
    }),

  reserve: authedQuery
    .input(
      z.object({
        showId: z.number(),
        seatNumbers: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if seats are available
      for (const seatNum of input.seatNumbers) {
        const [seat] = await db
          .select()
          .from(seats)
          .where(
            and(
              eq(seats.showId, input.showId),
              eq(seats.seatNumber, seatNum)
            )
          )
          .limit(1);

        if (!seat || seat.status !== "available") {
          return { success: false, message: `Seat ${seatNum} is not available` };
        }
      }

      // Reserve seats
      for (const seatNum of input.seatNumbers) {
        await db
          .update(seats)
          .set({ status: "reserved" })
          .where(
            and(
              eq(seats.showId, input.showId),
              eq(seats.seatNumber, seatNum)
            )
          );
      }

      return { success: true, message: "Seats reserved" };
    }),

  release: authedQuery
    .input(
      z.object({
        showId: z.number(),
        seatNumbers: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      for (const seatNum of input.seatNumbers) {
        await db
          .update(seats)
          .set({ status: "available" })
          .where(
            and(
              eq(seats.showId, input.showId),
              eq(seats.seatNumber, seatNum)
            )
          );
      }

      return { success: true, message: "Seats released" };
    }),

  book: authedQuery
    .input(
      z.object({
        showId: z.number(),
        seatNumbers: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      for (const seatNum of input.seatNumbers) {
        await db
          .update(seats)
          .set({ status: "booked" })
          .where(
            and(
              eq(seats.showId, input.showId),
              eq(seats.seatNumber, seatNum)
            )
          );
      }

      return { success: true, message: "Seats booked" };
    }),
});
