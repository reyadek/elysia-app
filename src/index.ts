import { Elysia, t } from "elysia";
import { UserController } from "./controllers/UserController";

const app = new Elysia();

const userIdDTO = t.Object({
  id: t.Numeric(),
});

const userDTO = t.Object({
  email: t.String(),
  password: t.String(),
});

app.get("/", () => "Hello Elysia");

app.group("/user", (app) =>
  app
    .get("/", UserController.getUsers)
    .get("/:id", ({ params: { id } }) => UserController.getUserById(id), {
      params: userIdDTO,
    })
    .post("/create", ({ body }) => UserController.createUser(body), {
      body: userDTO,
    })
    .post(
      "/update/:id",
      ({ params: { id }, body }) => UserController.updateUser(id, body),
      {
        params: userIdDTO,
        body: userDTO,
      }
    )
    .post(
      "/delete/:id",
      ({ params: { id } }) => UserController.deleteUser(id),
      {
        params: userIdDTO,
      }
    )
);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
