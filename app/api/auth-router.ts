import * as cookie from "cookie";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { env } from "./lib/env";
import { upsertUser } from "./queries/users";
import { signSessionToken } from "./cinebook/session";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
  mockLogin: publicQuery
    .input(z.object({ role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input, ctx }) => {
      const unionId = input.role === "admin" ? (env.ownerUnionId || "mock_owner_union_id") : "mock_user_union_id";
      const name = input.role === "admin" ? "Mock Admin" : "Mock User";
      const avatar = input.role === "admin" 
        ? "https://api.dicebear.com/7.x/bottts/svg?seed=admin" 
        : "https://api.dicebear.com/7.x/bottts/svg?seed=user";
      
      await upsertUser({
        unionId,
        name,
        avatar,
        role: input.role,
        lastSignInAt: new Date(),
      });

      const token = await signSessionToken({
        unionId,
        clientId: env.appId,
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        })
      );

      return { success: true };
    }),
});
