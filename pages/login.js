import React, {useEffect} from 'react'
import {FcGoogle} from 'react-icons/fc';
import { AiFillGithub } from "react-icons/ai";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import {useRouter} from 'next/router';
import {auth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'; 

const Login = () => {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  // google login
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        route.push('/');
    } catch (error) {
        console.log(error)
    }
  }

  // github login
  const githubProvider = new GithubAuthProvider();
  const GithubLogin = async () => {
    try { 
        const result = await signInWithPopup(auth, githubProvider);   
        route.push('/');  
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if(user){
      route.push('/');
    }else{
      console.log('login');
    }
  }, [user])

  return (
    <div className='shadow-xl mt-32 p-10 text-gray-800 rounded-lg'>
    <h2 className='text-2xl font-bold'>Join</h2>
    <div className='py-4'>
        <button onClick={GoogleLogin} className='text-white bg-gray-800 w-full rounded-lg flex align-middle p-4 gap-2'>
          <FcGoogle className='text-2xl'/> Sign in with Google
        </button>
        <button onClick={GithubLogin} className='text-white mt-6 bg-gray-800 w-full rounded-lg flex align-middle p-4 gap-2'>
          <AiFillGithub className='text-2xl'/> Sign in with Github
        </button>
    </div>
</div>
  )
}

export default Login  