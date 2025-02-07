export default async function getKakaoAccessToken(code: string): Promise<{ access_token: string, error?: string }> {

  const accessTokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URL!,
  });
  
  const accessTokenURL = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`;

  const {error, access_token} = await (await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })).json();
  
  return{error, access_token};
};