import { z } from "zod";

const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

export function validate(body: FormData) {
  return schema.safeParse(body);
}
