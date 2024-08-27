import { z } from "zod";

const schema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
  })
  .strict();

type FormData = z.infer<typeof schema>;

export function validate(body: FormData) {
  return schema.safeParse(body);
}
