import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile,signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import {toast} from 'react-toastify'
import {storage} from '../utils/firebase'

const DashboardProfileEdit = () => {
    const [user, loading] = useAuthState(auth);
    const [photo, setPhoto] = useState(null);
    const [loadings, setLoadings] = useState(false);
    const [photoURL, setPhotoURL] = useState(
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    );
    const route = useRouter();
  
    async function upload(file, user, setLoadings) {
      const fileRef = ref(storage, user.uid + ".png");
  
      setLoadings(true);
  
      const snapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
  
      updateProfile(user, { photoURL });
  
      setLoadings(false);
      toast.success("프로필 이미지가 변경됐습니다.✔", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

    }
  
    function handleChange(e) {
      if (e.target.files[0]) {
        setPhoto(e.target.files[0]);
      }
    }
  
    function handleClick() {
      upload(photo, user, setLoadings);
    }

    // 로그아웃 
    function logout(){
        return signOut(auth);
    }
    
    const handleLogout = async () => {
        try {
          await logout();
          route.push('/login')
        } catch {
          console.log("error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end">
                <button
                onClick={handleLogout}
                type="button"
                className="text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                    Logout
                </button>
            </div>
            <div className="font-bold text-xl mt-20">Profile Image</div>
            {/* photoURL이 없을떄에는 기존 아바타 가져와서 적용 있을때는 프로필 사진 보여주기 */}
            <div className="flex justify-center mt-8">
                {user?.photoURL ? (
                    <div>
                        <img
                            className="w-64 h-64 rounded-full"
                            src={user.photoURL}
                            alt="Avatar"
                        />
                    </div>
                ) : (
                    <div>
                        <img
                            src={photoURL}
                            alt="Avatar"
                            className="w-64 h-64 rounded-full"
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-6">
                <input
                    type="file"
                    onChange={handleChange}
                    className="block w-64 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    disabled={loading || !photo}
                    onClick={handleClick}
                    className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                    Upload
                </button>
            </div>
        </div>
    )
}

export default DashboardProfileEdit;