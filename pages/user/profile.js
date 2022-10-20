import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import ProfileImageEdit from "../../components/user/ProfileImageEdit";
import { useRouter } from 'next/router';
import ProfileNameEdit from "../../components/user/ProfileNameEdit";


const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  // user가 없을시 페이지 못들어오게
  useEffect(() => {
    if(!user){
      route.push('/')
    }
  },[])

  return (
    <div className="pb-4">
      <ProfileNameEdit />
      <ProfileImageEdit />
    </div>
  );
};

export default Profile;
