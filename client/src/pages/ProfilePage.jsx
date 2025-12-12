import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets';
const ProfilePage=()=> {

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState("Martin Johnson")
  const [bio,setBio] = useState("Hi Everyone, I am Using QuickChat")

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-certer justify-between max-sm:flex-col-reverse rounded-lg'>
        <form className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={()=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'} `} />
            upload profile image
          </label>
          <input onChange={(e)=>setName} value={name}
          type="text" required placeholder='You name' className='p-2 border border-gray-500 rounded-md focus:outlie none focus :ring-2' />
        </form>
        <img src="" alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
