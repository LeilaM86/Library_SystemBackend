import { z } from "zod";

const schema = z.object({
  name: z.string(),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(5, { message: "Password is too short" }),
});

type FormData = z.infer<typeof schema>;

export function validate(body: FormData) {
  return schema.safeParse(body);
}
