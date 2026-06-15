import { describe, it, expect } from "vitest";
import { appRouter } from "./router";

describe("Show Router API Tests", () => {
  it("should list available shows by movie id and date string", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const result = await caller.show.list({
      movieId: 1,
      date: todayStr,
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("showTime");
      expect(result[0]).toHaveProperty("theaterName");
    }
  });

  it("should fetch a single show by id", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const result = await caller.show.byId({ id: 1 });
    expect(result).not.toBeNull();
    if (result) {
      expect(result.id).toBe(1);
      expect(result).toHaveProperty("movieTitle");
      expect(result).toHaveProperty("theaterName");
    }
  });

  it("should fetch showtimes for a movie and date", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const result = await caller.show.times({
      movieId: 1,
      date: todayStr,
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("showTime");
      expect(result[0]).toHaveProperty("screenName");
      expect(result[0]).toHaveProperty("format");
    }
  });

  it("should filter list of available shows by city", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const result = await caller.show.list({
      movieId: 1,
      date: todayStr,
      city: "New York",
    });

    expect(Array.isArray(result)).toBe(true);
    for (const show of result) {
      expect(show.theaterCity).toBe("New York");
    }
  });

  it("should filter list of available shows by theaterId", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const result = await caller.show.list({
      movieId: 1,
      date: todayStr,
      theaterId: 1,
    });

    expect(Array.isArray(result)).toBe(true);
    for (const show of result) {
      expect(show.theaterId).toBe(1);
    }
  });

  it("should return empty list for dates with no shows", async () => {
    const caller = appRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
    });

    const result = await caller.show.list({
      movieId: 1,
      date: "2099-12-31",
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
