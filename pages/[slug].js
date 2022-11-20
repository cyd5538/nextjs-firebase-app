import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import SlugItem from '../components/slug/SlugItem';
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, db } from '../utils/firebase';
import { toast } from 'react-toastify';
import { arrayUnion, Timestamp, updateDoc, doc, getDoc, deleteField, arrayRemove } from 'firebase/firestore';
import Comment from '../components/slug/Comment';
import { AiOutlineDelete,AiOutlineEdit } from "react-icons/ai";

const PostDetails = () => {
  const [user, loading] = useAuthState(auth);
  const [message, setMessage] = useState('')
  const [allMessages, setAllMessages] = useState([]);
  const [messageEdit, setMessageEdit] = useState('');
  const router = useRouter();
  const routeData = router.query;


  
  const submitMessage = async() => {
    
    //로그인 안되어있으면
    if(!user){
      toast.error("로그인이 필요합니다 👏",{
        position: toast.POSITION.TOP_CENTER,
        duration: 1000
    })
      return router.push('/login');
    } 

    // 메세지 비어있으면
    if(!message){
        toast.error("메세지를 입력해주세요 🕳",{
            position: toast.POSITION.TOP_CENTER,
            duration: 1000
        })
        return
    }
    // post의 id값을 가져와서 update
    const docRef = doc(db, 'posts', routeData.id);
    await updateDoc(docRef, {
        comments: arrayUnion({
            message,
            avatar: user.photoURL,
            userName : user.displayName,
            time : Timestamp.now(),
            user: user.uid
        }),
    })
    setMessage(''); 
    }

    // Delete Post
    const deleteComment = async(id,message) => {
      const docRef = doc(db, 'posts', routeData.id)
      await updateDoc(docRef, {
        comments: arrayRemove({
          message,
          avatar: user.photoURL,
          userName : user.displayName,
          time : id,
          user: user.uid
        }),
        
      })
      getComments()
    }
    

    
    // 코멘트 가져오기
    const getComments = async () => {
      const docRef = doc(db, 'posts', routeData.id);
      const docSnap = await getDoc(docRef);
      setAllMessages(docSnap.data().comments);
    }

    useEffect(() => {
      // isReady 라우터 필드가 클라이언트 측에서 업데이트되고 사용할 준비가 되었는지 여부. 
      // useEffect 메소드 내에서만 사용해야하며 서버에서 조건부로 렌더링 하는 데에 사용해야한다.
      if(!router.isReady) return;
      getComments();

    },[ message ])

  return (
    <div>
      <SlugItem {...routeData} >
              <div className="my-4">
                <div className='flex'>
                    <input 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        type="text" 
                        placeholder="comment ✏"
                        className='bg-purple-900 w-full p-2 text-white text-sm' 
                    />
                    <button onClick={submitMessage} className='bg-cyan-800 text-white py-2 px-4'>
                        Submit
                    </button>
                </div>
                <div className='py-6'>
                    <h2 className='font-bold'>Comments</h2>
                    {allMessages?.map((message) => (
                      <Comment 
                        key={message.time}
                        avatar={message.avatar}
                        username={message.userName}
                        message={message.message}
                        time={message.time}
                        openchat={message.openchat}
                      >
                        {user?.uid === message.user ? 
                        (
                          <>
                            <button className='mr-2' onClick={() => deleteComment(message.time,message.message)}><AiOutlineDelete /></button>
                          </>
                        ) :
                        (
                          <></>
                        )} 
                      </Comment>
                    ))}
                </div>
            </div>
      </SlugItem>
    </div>
  )
}

export default PostDetails