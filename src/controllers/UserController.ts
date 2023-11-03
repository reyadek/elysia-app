import { Elysia } from "elysia";
import { db } from "../database/db";
import { userDTO, userIdDTO } from "../dto/user.dto";
import { isAuthenticated } from "../utils/isAuthenticated";

export const UserController = new Elysia()

  .use(isAuthenticated)

  .get("/", async ({ set }) => {
    const users = await db.user.findMany();

    set.status = 200;
    return {
      success: true,
      data: users,
      message: "users",
    };
  })

  //get user by id
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const user = await db.user.findUnique({
        where: {
          id: id,
        },
      });
      if (user) {
        set.status = 200;
        return {
          success: true,
          data: user,
          message: "user exist",
        };
      } else {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "user not exist",
        };
      }
    },
    {
      params: userIdDTO,
      afterHandle: ({ set }) => {
        set.status = 200;
        console.log("after handle");
      },
    }
  )

  //update user
  .post(
    "/update/:id",
    async ({ params: { id }, body, set }) => {
      const find_user = await db.user.findUnique({
        where: {
          id: id,
        },
      });

      if (find_user) {
        const updateUser = await db.user.update({
          where: {
            id: id,
          },
          data: {
            email: body.email,
            password: body.password,
          },
        });

        set.status = 200;
        return {
          success: true,
          message: "user updated",
          data: {
            user: updateUser,
          },
        };
      } else {
        set.status = 200;
        return {
          success: true,
          message: "user not found",
          data: null,
        };
      }
    },
    {
      params: userIdDTO,
      body: userDTO,
    }
  )

  //delete user
  .post(
    "/delete/:id",
    async ({ params: { id }, set }) => {
      const find_user = await db.user.findUnique({
        where: {
          id: id,
        },
      });

      if (find_user) {
        const deleteUser = await db.user.delete({
          where: {
            id: id,
          },
        });

        set.status = 200;
        return {
          success: true,
          message: "user not exist",
          data: deleteUser,
        };
      } else {
        set.status = 400;
        return {
          success: true,
          message: "user not exist",
          data: null,
        };
      }
    },
    {
      params: userIdDTO,
    }
  );
