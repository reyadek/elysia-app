import { PrismaClient, Prisma } from "@prisma/client";
const db = new PrismaClient();

interface IUser {
  id?: number;
  email: string;
  password: string;
}

export const UserController = {
  getUsers: async () => {
    return await db.user.findMany();
  },

  getUserById: async (id: number) => {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    } else {
      return {
        error: "user not found",
      };
    }
  },

  createUser: async (body: IUser) => {
    try {
      return await db.user.create({
        data: body,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log(
            "There is a unique constraint violation, a new user cannot be created with this email"
          );
          return {
            error: "Username must be unique",
          };
        }
      }
      throw e;
    }
  },

  updateUser: async (id: number, body: IUser) => {
    const find_user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    try {
      if (find_user) {
        return await db.user.update({
          where: {
            id: id,
          },
          data: {
            email: body.email,
            password: body.password,
          },
        });
      } else {
        return {
          error: "user not found",
        };
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log(
            "There is a unique constraint violation, a new user cannot be created with this email"
          );
          return {
            error: "Username must be unique",
          };
        }
      }
      throw e;
    }
  },

  deleteUser: async (id: number) => {
    const find_user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (find_user) {
      return await db.user.delete({
        where: {
          id: id,
        },
      });
    } else {
      return {
        error: "user not found",
      };
    }
  },
};
