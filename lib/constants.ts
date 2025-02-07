//유효성 체크 부분 정의
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MIN_LENGTH_ERROR = "닉네임은 최소 2자 이상이어야 합니다.";
export const USERNAME_REGEX = new RegExp(/^[가-힣a-zA-Z0-9._\-]+$/);

export const EMAIL_ERROR = "유효한 이메일 형식이 아닙니다.";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_ERROR = "비밀번호는 최소 8자 이상이어야 합니다.";
export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
export const PASSWORD_REGEX_ERROR = "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.";

export const PRODUCT_MIN_LENGTH_ERROR = "제품 설명은 최소 20자 이상이어야 합니다.";
export const PRODUCT_MAX_LENGTH_ERROR = "제목은 15자 이내로 작성해주세요.";

export const POST_MIN_LENGTH_ERROR = "게시글은 최소 10자 이상이어야 합니다.";

export const STREAM_TITLE_MIN_LENGTH = "제목은 최소 2자 이상이어야 합니다.";