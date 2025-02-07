//security 기능
/* import { experimental_taintObjectReference, experimental_taintUniqueValue } from "react"; */
import HackedComponent from "./hacked-component";

function getData(){
  const secret = {
    apiKey: "123456",
    secretKey: "0000",
  }
  /* experimental_taintObjectReference("error messages: API KEY 들어있음",secret); */
  /* experimental_taintUniqueValue("error messages: secretKey 들어있음",secret, secret.apiKey); */
  return secret;
} //client compo로 반환하면 안되는 정보를 가진 함수

export default async function Extras() {
  const data = getData();
  return(
  <div>
    <h1 className="text-8xl font-RubikPuddles">Extras</h1>
    <span className="text-2xl">so much more learn!</span>

    <HackedComponent data = {data}/>
  </div>
  );
}