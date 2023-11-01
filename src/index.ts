import { Elysia } from "elysia";
import { UserController } from "./controllers/UserController";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { AuthController } from "./controllers/AuthController";

const app = new Elysia();

app.get("/", () => "Hello Elysia");
app
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .use(cookie())
  .use(AuthController);

app.group("/user", (route) => route.use(UserController));

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
