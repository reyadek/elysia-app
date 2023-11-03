import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { db } from "../database/db";
import { userDTO } from "../dto/user.dto";
import { comparePassword, createHashPassword } from "../utils/auth";

export const AuthController = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRETS!,
      exp: process.env.JWT_EXPIRED,
    })
  )
  .use(cookie())

  //user create
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password } = body;
      const emailExists = await db.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (emailExists) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "email address already in use",
        };
      }

      const hashAndSalt = await createHashPassword(password);
      //return hash_and_salt;
      const newUser = await db.user.create({
        data: {
          email: email,
          password: password,
          hash: hashAndSalt.hash,
          salt: hashAndSalt.salt,
        },
      });

      set.status = 200;
      return {
        success: true,
        message: "user created",
        data: {
          user: newUser,
        },
      };
    },
    {
      body: userDTO,
    }
  )
  .post(
    "login",
    async ({ body, cookie, setCookie, set, jwt }) => {
      const { email, password } = body;
      const user = await db.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          hash: true,
          salt: true,
        },
      });

      if (!user) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "invalid credentials",
        };
      }

      // compare password
      const match = await comparePassword(password, user.salt, user.hash);
      if (!match) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "invalid credentials",
        };
      }

      // generate access
      const accessToken = await jwt.sign({
        email,
      });

      // set access token to cookie
      setCookie("auth", accessToken, {
        httpOnly: true,
        maxAge: 7 * 86400,
      });

      // return setCookieAccessToken.value;

      set.status = 200;
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
        },
        accessToken: accessToken,
        message: "login success",
      };
    },
    {
      body: userDTO,
    }
  );
