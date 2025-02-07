/* 
1) params: [id]는 단일 params.
(ex. /extras, /extras/1 사용가능) 

2) multiple params(catch-all segments): [...id]는 여러개의 params 받을 때 사용.

(ex. extras/1, /extras/1/2/3 사용가능, /extras는 notfound) 
3) optional catch-all params: [[...id]]는 params 없어도 괜찮음.
(ex. /extras, /extras/1, /extras/1/2/3 사용가능) 
*/
import { revalidatePath } from "next/cache";

/* export default function Extras({ params }: { params: { id: 
  string[]} }) { */

async function getData(){
  const data = await fetch('https://nomad-movies.nomadcoders.workers.dev/movies');
};

export default async function Extras() {
    // console.log(params);
    await getData();

    const action = async()=>{
      "use server";
      revalidatePath("/extras");
    }

    return(
    <div>
      <h1 className="text-8xl font-RubikPuddles">Extras</h1>
      <span className="text-2xl">so much more learn!</span>
      <form action={action}>
        <button className="text-secondary">재전송</button>
      </form>
    </div>
  );
}