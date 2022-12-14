import React from 'react'
import Link from 'next/link'

const SlugItem = ({ children, avatar, username, title, openchat, progress, recruitment, period, text, stack, player, startday }) => {

    return (
        <div className='mb-8 p-6 max-w-md min-w-[100%] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
            <div>
                <h2 className='font-bold text-4xl mb-4'>{title}</h2>
            </div>
            <div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <img src={avatar} className="w-12 h-12 rounded-full" />
                        <h2 className='font-500 text-sm'>{username}</h2>
                    </div>
                </div>
                <div className='flex flex-wrap mt-10'>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>모집 구분</label>
                        <div className='text-md md:text-2xl font-bold'>{recruitment}</div>
                    </div>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>진행 방식</label>
                        <div className='text-md md:text-2xl font-bold'>{progress}</div>
                    </div>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>모집 인원</label>
                        <div className='text-md md:text-2xl font-bold'>{player}</div>
                    </div>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>시작 예정</label>
                        <div className='text-md md:text-2xl font-bold'>{startday}</div>
                    </div>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>오픈 채팅</label>
                        <div className='text-md md:text-2xl font-bold text-purple-300 underline decoration-current'>
                        <Link
                                href={`${openchat}`}
                                passHref
                            >
                                링크 바로가기
                        </Link>
                        </div>
                    </div>
                    <div className='flex gap-8 w-1/2 mb-4'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>예상 기간</label>
                        <div className='text-md md:text-2xl font-bold'>{period}</div>
                    </div>
                    <div className='flex gap-8 w-full mb-10'>
                        <label className='text-md md:text-2xl font-bold text-gray-500 opacity-60'>사용할 기술</label>
                        <div className='text-md md:text-2xl font-bold'>{stack}</div>
                    </div>  
                    {/* DOM에서 innerHTML을 사용하기 위한 React의 대체 방법*/}
                    <div className='mb-12' dangerouslySetInnerHTML={{ __html: text }}></div>
                </div>

            </div>
            {children}
        </div>
    )
}

export default SlugItem