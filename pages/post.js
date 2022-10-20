import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadString, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

export default function Post() {
  const [post, setPost] = useState({ text: "", caption: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [changeFile, setChangeFile] = useState({image : null});
  const [user, loading] = useAuthState(auth);
  const [loadings, setLoadings] = useState(false);
  const route = useRouter();
  const filePickerRef = useRef(null);
  const routeData = route.query;
 

  async function uploadPost() {
    if (loadings) return;

    setLoadings(true);

    if (post.text.length > 300) {
      toast.error("Text가 너무 많습니다 ❌", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    // query로 넘긴 id값이 있을때는 update

    if(post?.hasOwnProperty("id")){
      const docRef = doc(db, 'posts', post.id);
      const updatedPost = {...post, timestamp: serverTimestamp()};
      const imageRef = ref(storage, `posts/${docRef.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url").then(
        async (snapshot) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", docRef.id), {
            image: downloadURL,
          });
        }
      );
      await updateDoc(docRef,updatedPost);
      return route.push('/')
    }else{
    
    // firestore에 저장
    const docRef = await addDoc(collection(db, "posts"), {
      caption: post.caption,
      text: post.text,
      username: user.displayName,
      user: user.uid,
      avatar: user.photoURL,
      timestamp: serverTimestamp(),
    });

    // storage에 저장하면서 docRef posts에 넣어줌
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
    setLoadings(false);
    setSelectedFile(null);
    route.push("/");
    }
   
  }

  function addImageToPost(e) {
    // 이미지 미리보기
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  }

  // checkuser
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/login");
    if (routeData.id) {
      setPost({
        text: routeData.text,
        id: routeData.id,
        caption: routeData.caption,
        
      });
      setChangeFile({
        image : routeData.image
      })

    }
  };


  useEffect(() => {
    checkUser();
  }, [loading, user]);

  return (
    <div>
      <div className="flex flex-col justify-center items-center h-[100%]">
        {selectedFile ? (
          <img
            onClick={() => setSelectedFile(null)}
            src={selectedFile}
            alt=""
            className="w-full max-h-[250px] object-cover cursor-pointer"
          />
        ) : (
          <img
            src={changeFile?.image !== null ? `${changeFile?.image}` : "data:image/png;base64,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"}
            onClick={() => filePickerRef.current.click()}
            className={changeFile?.image !== null ? 'w-full max-h-[250px] object-cover cursor-pointer' : 'cursor-pointer h-40 w-40 p-1 rounded-full border-1'}
          ></img>
        )}
        <input
          type="file"
          hidden
          ref={filePickerRef}
          onChange={addImageToPost}
        />
        <input
          type="text"
          maxLength="30"
          placeholder="제목을 입력해주세요"
          className="m-4 border-none text-center w-full focus:ring-0 text-purple-900 bold"
          value={post.caption}
          onChange={(e) => setPost({ ...post, caption: e.target.value })}
        />
        <textarea
          value={post.text}
          onChange={(e) => setPost({ ...post, text: e.target.value })}
          className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 mb-2 text-sm mt-2"
        ></textarea>
        <p
          className={`text-cyan-600 font-midium mb-8 text-sm ${
            post.text.length > 300 ? "text-red-600" : ""
          }`}
        >
          {post.text.length}/300
        </p>
        <button
          disabled={!selectedFile || !post.text || !post.caption}
          onClick={uploadPost}
          className="w-full mb-4 bg-gray-700 text-white p-2 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          Upload Post
        </button>
      </div>
    </div>
  );
}
