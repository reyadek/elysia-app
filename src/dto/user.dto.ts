import { t } from "elysia";
export const userIdDTO = t.Object({
  id: t.Numeric(),
});

export const userDTO = t.Object({
  email: t.String(),
  password: t.String(),
});
