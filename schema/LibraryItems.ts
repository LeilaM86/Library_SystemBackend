import { z } from "zod";

export const libraryItemSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1),
  abbreviation: z.string(),
  type: z.enum(["book", "dvd", "audiobook", "referencebook"]),
  isBorrowable: z.boolean(),
  categoryId: z.string().cuid(),
  borrower: z.string().optional().nullable(),
  borrowDate: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  nbrPages: z.number().optional().nullable(),
  runTimeMinutes: z.number().optional().nullable(),
});

export type LibraryItemData = z.infer<typeof libraryItemSchema>;

export function validateLibraryItem(body: any) {
  console.log("Validating library item body:", body);
  return libraryItemSchema.safeParse(body);
}
