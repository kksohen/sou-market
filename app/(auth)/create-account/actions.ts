"use server";
import { EMAIL_ERROR, PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, PASSWORD_REGEX, PASSWORD_REGEX_ERROR, USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR, USERNAME_REGEX } from "@/lib/constants";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {z} from "zod";
import updateSession from "@/lib/session/update-session";
//zod : 데이터 유효성 검사를 위한 라이브러리
//db 작업시 async, await 필수

const checkUsername = (username: string)=> {
  // ex) return !username.includes("potato"); !username.includes()가 false면 refine에 있는 메세지 출력
  const regex = USERNAME_REGEX;
  return regex.test(username);
};

/* const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select:{
      id: true,
    }
   });
   return !Boolean(user);// = if(user){return false;} else {return true;} = Boolean(user) === false = !user
}; */

const validDomains = ["gmail.com", "naver.com", "daum.net", "nate.com", "hanmail.net"];

const checkEmail = async(email: string) => {
  const domain = email.split("@")[1];
  return validDomains.includes(domain);
};

/* const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select:{
      id: true,
    }
   });
   return !user;
}; */

const checkPassword = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

//1.유효성 검사할 스키마 작성(데이터의 조건을 zod에게 설명)
const formSchema = z.object({
  username: z.string({
    invalid_type_error: "닉네임은 문자여야 합니다.",
    required_error: "닉네임을 입력해주세요.",
  }).min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR).toLowerCase().trim()
  /* .transform(username=>{return 필수}) */
  .refine(checkUsername, "사용할 수 없는 닉네임입니다.")
  /* .refine(checkUniqueUsername, "이미 사용 중인 닉네임입니다.") */
  , 
  email: z.string().email(EMAIL_ERROR).toLowerCase().refine(checkEmail, {
    message: "gmail.com, naver.com, daum.net, nate.com, hanmail.net 중 하나의 이메일을 사용해주세요.",
  })
  /* .refine(checkUniqueEmail, "이미 사용 중인 이메일입니다.") */
  ,
  password: z.string().min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  confirm_password: z.string().min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR),
})
.superRefine(async({username}, ctx)=>{
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select:{
      id: true,
    }
  });
  if(user){
    ctx.addIssue({
      code: "custom",
      message: "이미 사용 중인 닉네임입니다.",
      path: ["username"],
      fatal: true,
    });
    return z.NEVER; //검사 중단
  }
})
.superRefine(async({email}, ctx)=>{
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select:{
      id: true,
    }
  });
  if(user){
    ctx.addIssue({
      code: "custom",
      message: "이미 사용 중인 이메일입니다.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER; //검사 중단
  }
})
.refine(checkPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm_password"],
});

export async function createAccount(prevState: any, formData: FormData){
  //유효성 검사하고 싶은 데이터 오브젝트(input의 name)
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  // console.log(data);
  //2. 스키마에 맞는지 검사
  const result = await formSchema.spa(data); //spa = safeParseAsync
  if(!result.success){
    return result.error.flatten();
  }else{
    // console.log(result.data);
    /* else에서는 3번부터 진행ㅇ
    1. username이 존재하는지 확인 
    2. email이 존재하는지 확인
    3. 1,2 false(checkUniqueUsername, checkUniqueEmail로 zod 유효성 검사ㅇ) 
    -> hash password(npm i bcrypt)
    4. user를 db(prisma)에 저장
    5. login(npm i iron-session) -> redirect("/home")
    */
   const hashedPassword = await bcrypt.hash(result.data.password, 12);
   const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    }
   });
  await updateSession(user.id);
  redirect("/profile");
  }
};