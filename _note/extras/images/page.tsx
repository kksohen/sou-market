/* Image 최적화!!!
<local image>
placeholder="empty"로 설정 -> 이미지 로딩시 이미지 노출X 
placeholder="blur"로 설정(추천) -> 이미지 로딩시 블러처리된 이미지 노출O

<server image>
placeholder="이미지 로딩때 보여줄 이미지 넣어줄 수 있음" -> base64로 변환된 용량 적은 이미지(변환사이트: https://www.base64-image.de/) 
-> 그러나 블러처리X 그래서 
blurDataURL="이미지 로딩때 보여줄 base64 이미지"
placeholder="blur" 함께 써야 함(dynamic images)
*/
import Image from "next/image";
import heavyImg from "../../../public/image1.jpg";

export default async function Extras() {
  return(
  <div>
    <h1 className="text-8xl font-RubikPuddles">Extras</h1>
    <span className="text-2xl">so much more learn!</span>
    <Image src={heavyImg} alt="heavyImg" placeholder="blur"></Image>
  </div>
  );
}