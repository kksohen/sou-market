import { PRODUCT_MAX_LENGTH_ERROR, PRODUCT_MIN_LENGTH_ERROR } from "@/lib/constants";
import { z } from "zod";

// const imageExtensions = ["jpg", "jpeg", "png"];

export const productSchema = z.object({
  photo: z.string({
    required_error: "제품이 잘 드러나는 사진을 추가해주세요.",
  })
  /* .refine((value)=>{
    const extension = value.split(".").pop()?.toLowerCase();
    return extension && imageExtensions.includes(extension);
  }, {message: "jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다."}) */
  ,
  title: z.string({
    required_error: "제목을 기입해주세요.",
  }).max(15, PRODUCT_MAX_LENGTH_ERROR),
  price: z.coerce.number({//form에서 받아오는 값은 모두 string이므로 coerce 사용해 number로 변환시켜줌
    required_error: "가격을 입력해주세요.",
  }),
  description: z.string({
    required_error: "제품에 대한 자세한 설명을 적어주세요.",
  }).min(20, PRODUCT_MIN_LENGTH_ERROR),
});

export type ProductType = z.infer<typeof productSchema>;