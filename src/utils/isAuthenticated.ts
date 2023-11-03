import { Elysia } from "elysia";
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
  .onRequest(() => {
    console.log("On request");
  })
  .on("beforeHandle", async ({ jwt, set, request: { headers } }) => {
    const access_token = headers.get("access");
    const check = await jwt.verify(access_token!);
    if (!check) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: check.email,
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
