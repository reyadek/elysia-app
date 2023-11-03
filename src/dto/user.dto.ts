import { t } from "elysia";
export const userIdDTO = t.Object({
  id: t.String(),
});

export const userDTO = t.Object({
  email: t.String(),
  password: t.String(),
  // hash: t.String(),
  // salt: t.String(),
});

