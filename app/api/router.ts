import { authRouter } from "./auth-router";
import { movieRouter } from "./movie-router";
import { theaterRouter } from "./theater-router";
import { showRouter } from "./show-router";
import { seatRouter } from "./seat-router";
import { bookingRouter } from "./booking-router";
import { reviewRouter } from "./review-router";
import { savedMovieRouter } from "./saved-movie-router";
import { analyticsRouter } from "./analytics-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  movie: movieRouter,
  theater: theaterRouter,
  show: showRouter,
  seat: seatRouter,
  booking: bookingRouter,
  review: reviewRouter,
  savedMovie: savedMovieRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
