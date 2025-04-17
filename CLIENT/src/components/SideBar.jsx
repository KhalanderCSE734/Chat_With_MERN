import React from 'react'

import './SideBar.css'

import { useContext,useEffect } from 'react';
import { AppContext } from '../App';
import { Users } from 'lucide-react';


const SideBar = () => {


  const { backEndURL, userData,
    messages,setMessages,users,setUsers,selectedUser,setSelectedUser,
   isUserLoading,setIsUserLoading,isMessagesLoading,setIsMessagesLoading, onlineUsers,setOnlineUsers } = useContext(AppContext);


   const getUsers = async ()=>{
    try{
      setIsUserLoading(true);

      const fetchOptions = {
        method:"GET",
        credentials:"include",
      }

      const response = await fetch(`${backEndURL}/api/messages/users`,fetchOptions);
      const data = await response.json();
      // console.log(data);
      if(data.success){
        setUsers(data.message);  
      }else{
        console.log("Error in Home page while fetching users",data);
      }



    }catch(error){
      console.log("Error in SideBar page while fetching users",error);
    }finally{
      setIsUserLoading(false);
    }
  }



  useEffect(()=>{
    getUsers();
  },[]);

  useEffect(()=>{ 

    console.log("Online users in sidebar",onlineUsers);
  },[onlineUsers]);

  if(isUserLoading){
    return(
      <h1>Loading...</h1>
    )
  }


  return (



    <div className='sidebar' style={{borderRight:"1px solid black"}}>

      <div className="border-base-300 w-full p-5 text-3xl">
        <div className="flex items-center gap-2" style={{padding:"5px 10px"}}>
          <Users className="size-6" />
          <span className="font-medium" style={{paddingLeft:"10px"}}>Contacts</span>
        </div>
      </div>

      <div className="users">
      {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/user.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>


    </div>
  )
}

export default SideBar