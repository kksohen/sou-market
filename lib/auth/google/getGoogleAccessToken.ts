export default async function getGoogleAccessToken(code: string){

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    grant_type: 'authorization_code',
    code,
  }).toString();

  const accessTokenURL = `https://oauth2.googleapis.com/token?${accessTokenParams}`;

  const {error, access_token} = await (await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })).json();
  
  return{error, access_token};
};