import React from 'react'
import './ChatContainer.css'

import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';


const ChatContainer = () => {

  const { backEndURL, userData,
    messages,setMessages,users,setUsers,selectedUser,setSelectedUser,
   isUserLoading,setIsUserLoading,isMessagesLoading,setIsMessagesLoading, listenToMessages, unLitenToMessages } = useContext(AppContext);


   const messageEndRef = useRef(null);
  

   const getMessages = async (userId)=>{

    try{
      
      setIsMessagesLoading(true);

      const fetchOptions = {
        method:"GET",
        credentials:"include",
      }

      const response = await fetch(`${backEndURL}/api/messages/:${userId}`,fetchOptions);
      const data = await response.json();
      if(data.success){
        // console.log(data.message);
        setMessages(data.message);
        // console.log("Data from getMessages in ChatContainer.jsx",data);
      }else{
        console.log("Error from getMessages in home.jsx",data);
      }

    }catch(error){
      console.log("Error While getting Messages from frontend",error);
    }finally{
        setIsMessagesLoading(false);
    }

  }


  useEffect(()=>{ 
    getMessages(selectedUser._id);
    //socket.io
    listenToMessages();

    return ()=>{
      return unLitenToMessages();
    }


  },[selectedUser]);



  useEffect(()=>{ 
    // console.log("Entered scroll down");
    messageEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);


  const formatMessageTime = (date)=>{
    return new Date(date).toLocaleTimeString("en-US",{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    });
  }




  if(isMessagesLoading){
    return <h1 className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 text-5xl"> Loading...... </h1>
  }

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-between bg-base-100/50" style={{padding:"5px 0px"}}>
        <ChatHeader/>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{width:"100%",padding:"10px"}}>

        <h1 style={{textAlign:"center"}}> Messages Are End-to-End Encrypted </h1>
        {messages.map((message) => (
          <div key={message._id} style={ message.senderId==userData.userId ? {width:"100%",display:"flex",justifyContent:"flex-end"} :{width:"100%",display:"flex",justifyContent:"flex-start"}}> 

          <div
            className={`chat ${message.senderId == userData.userId ? "chat-end" : "chat-start"}`} 
            >
            {/* ref={messageEndRef} */}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                {/* {
                  (message.senderId==userData.userId) ?
                  userData.profilePic!==""?
                  <img
                  src={
                    message.senderId === userData.userId
                    ? userData.profilePic || "/user.png"
                    : selectedUser.profilePic || "/user.png"
                  }
                  alt="profile pic"
                  />:
                  <div>
                    {userData.name.slice(0,1)}
                  </div>:
                  message.profilePic!==""?
                  <img
                  src={
                    message.senderId === userData.userId
                    ? userData.profilePic || "/user.png"
                    : selectedUser.profilePic || "/user.png"
                  }
                  alt="profile pic"
                  />:
                  <div>
                    {message.name.slice(0,1)}
                  </div>
                  
                } */}
                <img
                  src={
                    message.senderId === userData.userId
                    ? userData.profilePic || "/user.png"
                    : selectedUser.profilePic || "/user.png"
                  }
                  alt="profile pic"
                  />

              </div>
            </div>
            
            <div className="chat-bubble flex flex-col" style={{marginTop:"10px"}}>
              {message.image && (
                <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p style={{width:"minmax(max-content,200px)",padding:"5px"}}>{message.text}</p>}




            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            </div>
            
          </div>

            </div>
        ))
        }
        <div  ref={messageEndRef}></div>
      </div>
            

        <MessageInput/>
    </div>
  );
}

export default ChatContainer