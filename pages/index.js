import Head from 'next/head'
import { useEffect, useState } from 'react'
import {db} from '../utils/firebase';
import { orderBy, collection, query, onSnapshot } from 'firebase/firestore';
import Link from 'next/link'
import Image from 'next/image'
import PostItem from '../components/post/PostItem';
import JAVASCRIPT from '../public/assets/JavaScript.svg'
import TYPESCRIPT from '../public/assets/TypeScript.svg'
import REACT from '../public/assets/React.svg'
import NEXTJS from  '../public/assets/Nextjs.svg'
import NODEJS from  '../public/assets/Nodejs.svg'
import JAVA from  '../public/assets/Java.svg'
import SPRING from  '../public/assets/Spring.svg'
import GO from  '../public/assets/Go.svg'


export default function Home() {
  const [allposts, setAllposts] = useState([]);
  const [toggleState, setToggleState] = useState(1);
  const [stackFilter, setStackFilter] = useState([]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

    // 모든 포스트 가져오기
    const getPosts = async () => {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAllposts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      return unsubscribe;
    };
  
    useEffect(() => {
      getPosts(allposts);
    }, []);

    const PushStack = (stack) => {
      stackFilter.indexOf(stack)>-1 ? 
      setStackFilter(stackFilter.filter((item)=>item!= stack)) : 
      setStackFilter([...stackFilter, stack])
    }

  console.log(allposts.map((post) => post.stack.map((stack) => stack.value)))
  console.log(stackFilter)
  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <div className='my-12 text-lg font-midium'>
        <div>
          <ul className='flex gap-2 text-2xl mb-10'>
            <li 
            className={toggleState === 1 ? "font-bold text-purple-800 cursor-pointer " : "text-black cursor-pointer"}
            onClick={() => toggleTab(1)}
            >
              프론트엔드
            </li>
            <li
            className={toggleState === 2 ? "font-bold text-purple-800 cursor-pointer " : "text-black cursor-pointer"}
            onClick={() => toggleTab(2)}
            >
              백엔드
            </li>
          </ul>
        </div>
        <div>
          <ul
            className={toggleState === 1 ? "flex gap-4 mb-10 text-xl " : "hidden"}
          >
            <li 
              onClick={() => PushStack('JavaScript')} 
              className={stackFilter.filter((item)=>item == 'JavaScript').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={JAVASCRIPT} alt="home" width="40" height="40" 
            />
                <span>JavaScript</span>
            </li>
            <li 
              onClick={() => PushStack('TypeScript')} 
              className={stackFilter.filter((item)=>item == 'TypeScript').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={TYPESCRIPT} alt="home" width="40" height="40" 
            />
                <span>TypeScript</span>
            </li>
            <li 
              onClick={() => PushStack('React')} 
              className={stackFilter.filter((item)=>item == 'React').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={REACT} alt="home" width="40" height="40" 
            />
                <span>React</span>
            </li>
            <li 
              onClick={() => PushStack('Nextjs')}  
              className={stackFilter.filter((item)=>item == 'Nextjs').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={NEXTJS} alt="home" width="40" height="40" 
            />
                <span>Nextjs</span>
            </li>
          </ul>
          <ul
            className={toggleState === 2 ? "flex gap-4 mb-10 text-xl " : "hidden"}
          >
            <li 
              onClick={() => PushStack('NodeJs')}  
              className={stackFilter.filter((item)=>item == 'NodeJs').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={NODEJS} alt="home" width="40" height="40" 
            />
                <span>NodeJs</span>
            </li>
            <li 
              onClick={() => PushStack('Java')}  
              className={stackFilter.filter((item)=>item == 'Java').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={JAVA} alt="home" width="40" height="40" 
            />
                <span>Java</span>
            </li>
            <li 
              onClick={() => PushStack('Spring')}  
              className={stackFilter.filter((item)=>item == 'Spring').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={SPRING} alt="home" width="40" height="40"
            />
                <span>Spring</span>
            </li>
            <li 
              onClick={() => PushStack('Go')}  
              className={stackFilter.filter((item)=>item == 'Go').length === 1 ? "flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl border-gray-100 text-gray-300" : 'flex items-center gap-2 cursor-pointer p-2 border-2 rounded-2xl'}><Image src={GO} alt="home" width="40" height="40" 
            />
                <span>Go</span>
            </li>
          </ul>
        </div>
        <div className='mb-10 flex items-center gap-8'>
          <ul className='flex gap-4'>
            {stackFilter.map((stack) => 
            <li
            key={stack} 
            onClick={() => setStackFilter(stackFilter.filter((item)=> item!= stack)) }
            className='bg-gray-400 p-2 text-white cursor-pointer'
            >
              {stack}
            </li>)}
          </ul>
          {stackFilter.length >= 1 ? 
          <button onClick={() => setStackFilter([])} className='bg-gray-100 p-2 text-black cursor-pointer'>
            필터 초기화 📵
          </button>
          :
            null
          }

        </div>
        <div className='flex gap-1 flex-wrap justify-around'>
          {allposts?.map((post) => (
            <PostItem key={post.id} {...post}>
              <div className='flex gap-4 mb-4 flex-wrap'>
                {post.stack.map((stack, index) => <div key={index} className='text-sm'>{stack.value}</div>)}
              </div>
              <Link href={{ pathname: `/${post.id}`, query: post  }} as={`/${post.id}`}>
                
                <button type="button" className="text-white bg-purple-400 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                  Comment <span className="font-bold">{post.comments?.length}</span>
                </button>
              </Link>
            </PostItem>
          ))}

        </div>
      </div>
      </main>
    </div>
  )
}
