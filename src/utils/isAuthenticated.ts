import { Elysia } from "elysia";
import cookie from "@elysiajs/cookie";
import { db } from "../database/db";
import jwt from "@elysiajs/jwt";

export const isAuthenticated = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRETS!,
      exp: process.env.JWT_EXPIRED,
    })
  )
  .use(cookie())
  .onRequest(() => {
    console.log("On request");
  })
  .on("beforeHandle", async ({ jwt, set, cookie }) => {
    //check access_token_cookie from cookie
    const verify = await jwt.verify(cookie!.access_token_cookie);
    if (!verify) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const user = await db.user.findUnique({
      where: {
        id: verify.id,
      },
    });

    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
  });
