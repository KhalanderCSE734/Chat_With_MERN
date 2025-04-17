import React from 'react'

import { useState, useEffect, useContext, } from 'react';

import { Lock, Mail, MessageSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const navigate = useNavigate();


  const { userData,backEndURL,getAuthStatus,setIsLoggedIn, socket,connectSocket, disConnectSocket } = useContext(AppContext);

  const [state,setState] = useState("signup");


  const [formDetails,setFormDetails] = useState({
    fullName:"",
    email:"",
    password:"",
  })

  const handleFormDetails = async (evt)=>{
    const name = evt.target.name;
    const value = evt.target.value;
    setFormDetails((prev)=>{
      return { ...prev,[name]:value };
    })
  }

  const handleFormSubmit = async (evt)=>{

    evt.preventDefault();
    
    try{
      const fetchOptions = {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(formDetails),
      }
      if(state==="signup"){
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,fetchOptions);  
        const data = await response.json();
        console.log("Data ", data);
        if(data.success){
          console.log("Form Submitted ",data);
          toast.success(data.message);
          setIsLoggedIn(true);
          getAuthStatus();
          navigate("/");
          connectSocket();
        }else{
          toast.error(data.message);
        }

      }else{

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,fetchOptions);  
        const data = await response.json();
        console.log("Data ", data);
        if(data.success){

          console.log("Form Submitted ",data);
          toast.success(data.message);
          setIsLoggedIn(true);
          getAuthStatus();
          navigate("/");

          connectSocket();

        }else{

          toast.error(data.message);

        }
      }
      
    }catch(error){
      toast.error(error.message);
    }
  }

  return (
    <>
       <div className="myContainer">


              <form className='left' onSubmit={handleFormSubmit}>

                {
                  state === "signup" ?
                    <div className="myHeading">
                        <MessageSquare className="text-primary text-6xl"/>
                      <h1> Create Account </h1>
                      <p> Get Started With Your Free Account </p>
                    </div>:
                    <div className="myHeading">
                      <MessageSquare className="text-primary text-6xl"/>
                      <h1> Login  </h1>
                      <p> Login Into Your Account  </p>
                    </div>

                }


                <div className="formElements">
                    {
                      state === "signup" &&

                    <div className="feild">
                        <User />
                        <input type="text" name="fullName" id="fullName" value={formDetails.fullName} onChange={handleFormDetails} placeholder='Enter Your FullName' required/>
                    </div>

                    }

                    <div className="feild">
                        <Mail />
                        <input type="email" name="email" id="email" value={formDetails.email} onChange={handleFormDetails} placeholder='Enter Your E-Mail' required/>
                    </div>
                    <div className="feild">
                        <Lock />
                        <input type="password" name="password" value={formDetails.password} onChange={handleFormDetails} id="password" placeholder='Enter Your PassWord' required/>
                    </div>
                </div>
                 {
                  state === "signup" ?
                  <button type="submit" className='btn btn-primary w-full'>  Create Account </button>:
                  <button type="submit" className='btn btn-primary w-full'>  Login </button>
                 }
                 {
                  state === "signup" ?
                  <p onClick={()=>{ setState('login') }}> Already Have An Account? <span className='underline text-blue-500 cursor-pointer'> Login </span> </p>:
                  <p onClick={()=>{ setState('signup') }}> Don't Have An Account? <span className='underline text-blue-500 cursor-pointer'> Create One </span> </p>
                 }
              </form>


          <div className="right">
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
            <div className="skeleton h-32 w-32 cursor-pointer" ></div>
          </div>

       </div>
    </>
  )
}

export default SignUp   