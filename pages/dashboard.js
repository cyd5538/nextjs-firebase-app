import React, { useState,useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../utils/firebase";
import DashboardProfileEdit from "../components/DashboardProfileEdit";
import { useRouter } from 'next/router';
import { collection, deleteDoc, onSnapshot, query, where, doc } from 'firebase/firestore';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import DashboardMypost from "../components/DashboardMypost";
import Link from 'next/link';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const route = useRouter();

  // user가 없을시 페이지 못들어오게
  useEffect(() => {
    if(!user){
      route.push('/')
    }
  },[])

const getData = async () => {
    if (loading) return;
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
};

// post 삭제
const deletePost = async(id) => {
  const docRef = doc(db, 'posts', id)
  await deleteDoc(docRef)
}

useEffect(() => {
  getData();
}, [user, loading])

  return (
    <div>
      <DashboardProfileEdit />
      <div>
        <h1 className="font-bold text-xl mt-12">My Post</h1>
        {posts.map((post) => (
          <DashboardMypost {...post} key={post.id} >
            <div className='flex gap-4 justify-end'>
              <button onClick={() => deletePost(post.id)} className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'>
                <BsTrash2Fill className='text-2xl' /> Delete
              </button>
              {/* query로 post 정보 보내기 */}
              <Link href={{pathname: '/post', query: post}}>
                <button className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'>
                    <AiFillEdit className='text-2xl'/> Edit
                </button>
              </Link>
            </div>
          </DashboardMypost>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
