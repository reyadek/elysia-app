import { Elysia } from "elysia";
import { PrismaClient, Prisma } from "@prisma/client";
import { userDTO, userIdDTO } from "../dto/user.dto";

const db = new PrismaClient();

export const UserController = new Elysia()

  //list user
  .onRequest(() => {
    console.log("On request");
  })
  .on("beforeHandle", () => {
    console.log("beforeHandle");
  })
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

  //user create
  .post(
    "/create",
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
      const newUser = await db.user.create({
        data: body,
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
    //   try {
    //     return await db.user.create({
    //       data: body,
    //     });
    //   } catch (e) {
    //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //       if (e.code === "P2002") {
    //         console.log(
    //           "There is a unique constraint violation, a new user cannot be created with this email"
    //         );
    //         return {
    //           error: "Username must be unique",
    //         };
    //       }
    //     }
    //     throw e;
    //   }
    // }
    {
      body: userDTO,
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

      try {
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
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            console.log(
              "There is a unique constraint violation, a new user cannot be created with this email"
            );

            set.status = 200;
            return {
              success: true,
              message: "email address already in use.",
              data: null,
            };
          }
        }
        throw e;
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
