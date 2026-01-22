import React, { useState } from 'react'
import { assets,  ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast'


const Sidebar = () => {

const [isSaving, setIsSaving] = useState(false);
const {user, axios, fetchUser} = useAppContext();
const location = useLocation()
const [image, setImage] = useState('')

const updateImage = async ()=>{

    if (isSaving) return; // 🛑 block double click
    setIsSaving(true);

  try {
    const formData = new FormData()
    formData.append('image',image)

    const {data} = await axios.post('/api/owner/update-image', formData)

    if(data.success){
      fetchUser()
      toast.success(data.message)
      setImage('')
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
    
  }finally {
    setIsSaving(false); // 🔓 always unlock
  }
}

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
      <div className='group relative'>
          <label htmlFor="image">
           <img
  src={image ? URL.createObjectURL(image) : user?.image || null}
  alt="profile"
  className="h-20 w-20 md:h-24 md:w-24 rounded-full mx-auto object-cover
             ring-2 ring-primary/30 shadow-sm hover:scale-105 transition"
/>


            <input type="file" id="image" accept='image/*' hidden onChange={e=>setImage(e.target.files[0])}/>

            <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex
            items-center justify-center cursor-pointer'>
                  <img src={assets.edit_icon} alt="icon" />
            </div>
          </label>
      </div>
{image && (
  <button
    disabled={isSaving}
    onClick={updateImage}
    className={`absolute top-0 right-0 flex items-center gap-2 p-2 rounded-md transition
      ${isSaving
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
  >
    {isSaving ? (
      <>
        <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
        Saving...
      </>
    ) : (
      <>
        Save <img src={assets.check_icon} width={13} alt="icon" />
      </>
    )}
  </button>
)}

      <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>

      <div className='w-full'>
          {ownerMenuLinks.map((link, index)=>(
              <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'}`}>
                <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
                <span className='max-md:hidden'>{link.name}</span>
                <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-1 right-0 absolute`}></div>
              </NavLink>
          ))}
      </div>
    </div>
  )
}

export default Sidebar
