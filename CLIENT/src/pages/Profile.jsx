import React from 'react'

import { useContext, useState } from 'react';

import { AppContext } from '../App'
import { Camera, Loader, Mail, Pencil, User } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {

  const { isLoggedIn,userData,backEndURL,setUserData } = useContext(AppContext);

  const [edit,setEdit] = useState(false);

  const [imageUploadLoad,setImageUploadLoad] = useState(false);

  const [editDetails,setEditDetails] = useState({
    name:"",
    email:"",
    profilePic:null,
  })

  const handleFormDetails = (evt)=>{
    const name = evt.target.name;
    const value = evt.target.value;
    setEditDetails((prev)=>{
      return { ...prev, [name]:value };
    })
  }


  const updateProfile = async(EditData)=>{
      try{
          setImageUploadLoad(true);
          const fetchOptions = {
            method:"PUT",
            credentials:"include",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify(EditData),
          }

          const response = await fetch(`${backEndURL}/api/auth/updateProfile`,fetchOptions);
          const data = await response.json();

          console.log("Udate Profile ",data);
          if(data.success){
            toast.success(data.message);
            setUserData(data.userData);
          }else{
            toast.error(data.message);
          }

      }catch(error){
          console.log("Error in calling update profile API ",error.message);
      }finally{
        setImageUploadLoad(false);
      }
  }

  const handleProfileChange = async(evt)=>{
    let file = evt.target.files[0];
    // file = file.name.replaceAll(" ","_").replaceAll("-","");
    // console.log(`${Date.now().toLocaleString().replaceAll(",","")}_${file}`);
    // console.log(new Date().toLocaleTimeString().split(" ")[0].replaceAll(":","_"));
    // console.log(file);

    if(!file){
      return;
    }

    const reader = new FileReader();

    // console.log(reader);     We won't haven anything in this now
    reader.readAsDataURL(file);
    // console.log(reader);

    reader.onload = async ()=>{
      const base64Image = reader.result;
      // console.log(base64Image);
      setEditDetails((prev)=>{
        return {...prev,profilePic:base64Image };
      });
      const EditData = {
        name:editDetails.name,
        email: editDetails.email ,
        profilePic: base64Image ,
      }
      await updateProfile(EditData);
    }




  }


  return (
    <>
        <div className="profileContainer">
          <div className="profile" style={{fontSize:"1.2rem"}}>
                <h1>Profile </h1>

            <div className="randomContainer" >
              <p>Your Profile Information</p>
                {
                  !edit ?   
                <Pencil onClick={()=>{ setEdit((prev)=>!prev) }} style={{cursor:"pointer"}}/>:
                <button onClick={ ()=>{ setEdit((prev)=>!prev) }} > Save Profile </button>
                }

            </div>


            <div className="imageContainer" style={{position:"relative"}}>
              {
                !imageUploadLoad ?
                <img src={ userData.profilePic || editDetails.profilePic || "/user.png" } alt="userImage" className='userImage' />
                :
                <Loader className="size-10 animate-spin"/>
              }

              <label htmlFor="icon">
                {
                  edit && 
                    <Camera style={{position:"absolute",left:"135px",bottom:"35px",width:"30px",cursor:"pointer",color:"red"}}/>
                }

                <input type="file" id="icon" className="hidden" onChange={handleProfileChange} />
              </label>

            </div>
                  {
                    edit && 
                    <p>  Click The Camera Icon to Update Your Photo</p>
                  }
              {
                !edit?
                <div className="info">
                
                <p>FullName</p>
                <div className="name"> { userData ? userData.name: "Your Name" } </div>
                <p>E-mail Address</p>
                <div className="name"> { userData ? userData.email: "E-Mail" } </div>
  
              </div> :

              <div className="info">
                
              <div className="name">
                        <User />
                        <input type="text" name="name" id="fullName" value={editDetails.name} onChange={handleFormDetails} placeholder='Edit Your Name' required/>
               </div>

               <div className="name">
                        <Mail />
                        <input type="email" name="email" id="email" value={editDetails.email} onChange={handleFormDetails} placeholder='Edit Your E-mail' required/>
                    </div>

            </div>

              }
            
              <h1 style={{fontSize:"2rem",marginTop:"20px"}} > Account Information </h1>

              <div className="info">
                
                <div className="account-info">
                        <p> Member Since </p> 
                        <p>  {userData ? userData.createdAt?.split("T")[0] : "14/04/2025"  } </p>
                 </div>
  
                 <div className="account-info">
                        <p> Account Status </p> 
                        <p className='text-green-600 text-xl'>  Active </p>
                </div>
  
              </div>
              
          </div>
        </div>
    </>
  )
}

export default Profile