import React, {useState,Fragment,useEffect} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Dialog, Transition } from '@headlessui/react'


const ProfileNameEdit = () => {
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState('');
    let [isOpen, setIsOpen] = useState(false)
 
    async function upload() {
        await updateProfile(user, {displayName: name})
        setIsOpen(false);
    }
   

    function closeModal() {
      setIsOpen(false)
    }
  
    function openModal() {
      setIsOpen(true)
    }

    return (
        <>
        <div className='flex items-center gap-2'>
            <div className='flex gap-2'>
                <span className='font-bold'>User :</span> 
                <span className='purple text-1xl'>{user?.displayName}</span>
            </div>
            <div>
                <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md bg-purple-800 bg-opacity-90 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    유저 네임 변경
                </button>
            </div>
            <Transition appear show={isOpen}  as={Fragment}>
            <Dialog as="div" className="relative" onClose={closeModal}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
    
                <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    <Dialog.Panel className="w- max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                        <div className="mt-2">
                        <p className="flex w-full items-center justify-around m-auto gap-6">
                            <input 
                            type="text" 
                            id="first_name" 
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-800 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required />
                            <div className='flex flex-wrap gap-1'>
                            <button className=' text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={upload}>
                                변경
                            </button>
                            <button
                                type="button"
                                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                onClick={closeModal}
                                >
                                취소
                            </button>
                            </div>
                        </p>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition>
        </div>
      </>
    )
}

export default ProfileNameEdit

