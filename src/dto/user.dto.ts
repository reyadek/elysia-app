import { t } from "elysia";

export const userIdDTO = t.Object({
  id: t.String(),
});

export const userDTO = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
});

export const userLoginDTO = t.Object({
  email: t.String(),
  password: t.String(),
});

export const userEditDTO = t.Object({
  name: t.String(),
});
