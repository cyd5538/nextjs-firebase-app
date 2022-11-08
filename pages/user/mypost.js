import React, {useEffect, useState} from "react";
import MypostEdit from "../../components/user/MypostEdit";
import { collection, onSnapshot, query, where,  } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../../utils/firebase";
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

const myPost = () => {
    const [posts, setPosts] = useState([]);
    const [user, loading] = useAuthState(auth);

    const getData = async () => {
        if (loading) return;
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("user", "==", user?.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort((a,b) => b.timestamp - a.timestamp));
        });
        return unsubscribe;
    };


    useEffect(() => {
      getData();
    }, [user, loading])

  return (
    <div>
      <h1 className="font-bold text-xl mt-12">My Post</h1>
      {posts.map((post) => (
        <MypostEdit {...post} key={post.id}>
          <Link href={{pathname: '/post', query: post}} as='/post'>
              <button className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" /> Edit
              </button>
          </Link>
        </MypostEdit>
      ))}
    </div>
  );
};

export default myPost;
