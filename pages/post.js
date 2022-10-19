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

  console.log(changeFile.image)

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
            className={changeFile?.image !== null ? 'w-full max-h-[250px] object-cover cursor-pointer' : 'cursor-pointer h-40 w-40 bg-purple-700 p-2 rounded-full border-2'}
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
          className="bg-purple-900 h-48 w-full text-white rounded-lg p-2 mb-2 text-sm mt-2"
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
          className="w-full bg-purple-700 text-white p-2 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          Upload Post
        </button>
      </div>
    </div>
  );
}
