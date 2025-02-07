import UpdateProfile from "@/components/profile-update";
import { getUserInfo } from "../actions";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

type Params = Promise<{
  id: string;
}>;

const getCachedProfile = nextCache(getUserInfo, ['profile-detail'], {
  tags: ['profile-detail'],
}); 

export default async function EditProfile({params}: {params : Params}) {
  const {id} = await params;
  const idNum = Number(id);
  if(isNaN(idNum)){
    return notFound();
  }
  const profile = await getCachedProfile(idNum);
  if(!profile){
    return notFound();
  }

  const DefaultPassword = {
    username: profile.username,
    email: profile.email || "",
    phone: profile.phone || "",
    avatar: profile.avatar || "",
    password: "",
    confirm_password: ""
}

  return(
    <div>
      <UpdateProfile user={DefaultPassword} userId={profile.id}/>
    </div>
  );
}