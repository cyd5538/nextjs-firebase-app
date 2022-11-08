import React, { Children } from 'react'
import { BsTrash2Fill } from 'react-icons/bs';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from "../../utils/firebase";


const MypostEdit = ({children, id, avatar, userName, title}) => {

    // post 삭제
    const deletePost = async(id) => {
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef)
    }

    return (
        <div className='bg-white p-8 border-b-2 rounded-lg'>
            <div className='flex items-center gap-2'>
                <img src={avatar} className="w-16 h-16 rounded-full" />
                <h2>{userName}</h2>
            </div>
            <div className='py-4'>
                <p>{title}</p>
            </div>

            <div className="flex gap-4 justify-end">
                <button
                onClick={() => deletePost(id)}
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                >
                <BsTrash2Fill className="text-2xl" /> Delete
                </button>
                {children}
            </div>
        </div>
    )
}

export default MypostEdit