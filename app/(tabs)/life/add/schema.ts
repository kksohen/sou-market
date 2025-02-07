import { POST_MIN_LENGTH_ERROR, PRODUCT_MAX_LENGTH_ERROR } from "@/lib/constants";
import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "제목을 기입해주세요.",
  }).max(15, PRODUCT_MAX_LENGTH_ERROR),
  description: z.string({
    required_error: "지금 이 순간을 사람들에게 공유해봐요",
  }).min(10, POST_MIN_LENGTH_ERROR),
});

export type PostType = z.infer<typeof postSchema>;