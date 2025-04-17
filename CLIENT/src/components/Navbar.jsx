import React from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { useContext, useEffect } from "react";
import { AppContext } from "../App";


import { toast } from 'react-toastify';

const Navbar = () => {

    const Navigate = useNavigate()

    // const value = useContext(AppContext);
    const { userData,backEndURL,getAuthStatus,isLoggedIn,setIsLoggedIn,setUserData,disConnectSocket } = useContext(AppContext);
    
    //  useEffect(()=>{ 
    //     // console.log("Inside NavBar", value.userData);
    //     console.log("Inside NavBar", userData, "BackEnd Url ", backEndURL);
    //     // getAuthStatus();
    // },[]); 

    const logOut = async()=>{
      try{
        const fetchOptions = {
          method:"POST",
          credentials:"include",
        }

        const response = await fetch(`${backEndURL}/api/auth/logOut`,fetchOptions);
        const data = await response.json();
        
        if(data.success){
          // console.log("LogOut data", data);
          setIsLoggedIn(false);
          setUserData(false);
          toast.success(data.message);
          disConnectSocket();
        }else{
          toast.error(data.message);
        }


      }catch(error){
        toast.error(error.message);
      }
    }

    const checkAuth = ()=>{
      if(!isLoggedIn){
        toast.warn("Login To Access The Profile Page");
      }else{
        Navigate("/profile");
      }
    }


  return (
    <>
      <div className="navbar bg-base-100 shadow-sm !p-3.5">
        <div className="flex-1">
          <div className="btn btn-ghost text-xl" onClick={()=>{ Navigate("/") }} > HOME </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 flex w-60 items-center justify-between">
            
            {
              !isLoggedIn&&
              <li> <NavLink to="/signUp"> Sign Up </NavLink> </li>
            }
            {
              isLoggedIn&&
              <li> <button onClick={logOut}> LogOut </button> </li>
            }

            <li> <NavLink to="/settings"> Settings </NavLink> </li>


            <li onClick={checkAuth} className='cursor-pointer'>  Profile</li>


          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
