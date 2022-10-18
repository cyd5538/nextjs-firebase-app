import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp, updateDoc,doc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

const Post = () => {
  const [post, setPost] = useState({ text: "" });
  const [value, setValue] = useState('');
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;


  // submit post
  const submitPost = async (e) => {
    e.preventDefault();

    // text가 비어있을 때 
    if(!post.text){
        toast.error('Text가 비어있습니다', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500
        });
        return;
    }

    // text가 300글자 이상일 떄
    if(post.text.length > 300){
        toast.error('Text가 너무 깁니다❌', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500
        });
        return;
    }

    // query로 넘긴 id값이 있을때는 update
    if(post?.hasOwnProperty("id")){
        const docRef = doc(db, 'posts', post.id);
        const updatedPost = {...post, timestamp: serverTimestamp()};
        await updateDoc(docRef,updatedPost);
        return route.push('/')
    }else{

    // 그렇지 않다면 새로운 post
    const collectionRef = collection(db, "posts");
    await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName
    })

    setPost({text: ""})
    toast.success("포스트 성공✔",{
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500 
    })
    return route.push('/');
    }
  }

  // 
  const checkUser = async () => {
    if(loading) return;
    if(!user) route.push('/login');
    if(routeData.id){
        setPost({ text: routeData.text, id: routeData.id})
    }
  };

  useEffect(() => {
    checkUser();
  },[loading, user])


  return (
    <div className='my-16 p-12 shadow-lg rounded-lg max-w-lg mx-auto'>
      <form onSubmit={submitPost}>
       <h1 className='text-2xl font-bold'>
        {/* hasOwnProperty 객체가 특정 프로퍼티를 가지고 있는지를 나타내는 Boolean 값을 반환 */}
        {post.hasOwnProperty('id') ? "글 수정하기 ✏" : "글 쓰기 ✏"}
       </h1>
       <div className='py-2'>
        <h3 className='text-lg font-medium py-2 text-purple-900'>Text</h3>
        <textarea                     
          value={post.text} 
          onChange={(e) => setPost({...post, text: e.target.value})}
          className='bg-purple-900 h-48 w-full text-white rounded-lg p-2 text-sm'
          >
        </textarea>
        <p className={`text-cyan-600 font-midium text-sm ${post.text.length > 300 ? 'text-red-600' : ''}`}>
          {post.text.length}/300
        </p>
       </div>
       <button 
          type="submit" 
          className='w-full bg-purple-500 text-white font-medium p-2 my-2 rounded-lg text-sm'>
          Submit
       </button>
      </form>
    </div>
  )
}

export default Post