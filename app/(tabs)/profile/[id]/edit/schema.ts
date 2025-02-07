import { PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR, USERNAME_REGEX } from "@/lib/constants";
import validator from "validator";
import { z } from "zod";
import { checkEmailAvailability, checkPhoneAvailability, checkUsernameAvailability } from "../actions";


const checkUsername = (username: string)=> {
  const regex = USERNAME_REGEX;
  return regex.test(username);
};

const validDomains = ["gmail.com", "naver.com", "daum.net", "nate.com", "hanmail.net"];
const checkEmail = async(email: string) => {
  const domain = email.split("@")[1];
  return validDomains.includes(domain);
};
/* const checkPassword = ({ password, confirm_password }: { password?: string, confirm_password?: string }) => password === confirm_password; */

export const profileSchema = z.object({
  username: z.string({
    invalid_type_error: "닉네임은 문자여야 합니다.",
    required_error: "닉네임을 입력해주세요.",
  }).min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR).toLowerCase().trim().refine(checkUsername, "사용할 수 없는 닉네임입니다."),
  email: z.string().toLowerCase().optional(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  phone: z.string().trim().optional(),
  avatar: z.string().optional(),
}).superRefine(async({username, email, phone, password, confirm_password}, ctx)=>{
  const usernameTaken = await checkUsernameAvailability(username);
  if(usernameTaken){
    ctx.addIssue({
      code: "custom",
      message: "이미 사용 중인 닉네임입니다.",
      path: ["username"],
      fatal: true
    });
    return z.NEVER;
  }
  if(email){
    const isValid = await checkEmail(email);
    if(!isValid){
      ctx.addIssue({
        code: "custom",
        message: "gmail.com, naver.com, daum.net, nate.com, hanmail.net 중 하나의 이메일을 사용해주세요.",
        path: ["email"],
      });
    }
    const emailTaken = await checkEmailAvailability(email);
    if(emailTaken){
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이메일입니다.",
        path: ["email"],
        fatal: true,
      });
    }
  }

  if(phone){
    const isValid = await validator.isMobilePhone(phone,"ko-KR");
    if(!isValid){
      ctx.addIssue({
        code: "custom",
        message: "올바른 전화번호 형식이 아닙니다.",
        path: ["phone"],
      })
    }
    const phoneTaken = await checkPhoneAvailability(phone);
    if(phoneTaken){
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 전화번호입니다.",
        path: ["phone"],
      });
    }
  }

  if(password || confirm_password){
    if(!password || password.length < PASSWORD_MIN_LENGTH){
      ctx.addIssue({
        code: "custom",
        message: PASSWORD_MIN_LENGTH_ERROR,
        path: ["password"],
      });
    }
    if(password !== confirm_password){
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirm_password"],
      });
    }
  }
});

export type ProfileType = z.infer<typeof profileSchema>;