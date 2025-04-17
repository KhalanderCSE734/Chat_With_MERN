import React from 'react';

import './App.css';



import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { createContext, useEffect, useState } from 'react';



import Navbar from './components/Navbar';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


import { Loader } from 'lucide-react';

import { Toaster } from 'react-hot-toast';



import { ToastContainer } from 'react-toastify'


import { io } from 'socket.io-client';


const AppContext = createContext();

const App = ()=>{


  const navigate = useNavigate();


  const [userData,setUserData] = useState(false);

  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  
  const [isCheckingAuth,setIsCheckingAuth]= useState(true);   // This is to Check Authentication of user when the page is refreshing
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  

  const getUserData = async ()=>{
    try{

      setIsCheckingAuth(true);


      const fetchOptions = {
        method:"GET",
        credentials:"include",
      }
      const response = await fetch(`${backEndURL}/api/auth/getUser`,fetchOptions);
      const data = await response.json();
      // console.log("Data from getAuthStatus ",data);
      if(data.success){
        // console.log("Data From GetAuthStatus ", data);
        console.log(data);
        setUserData(data.userData);
      }
    }catch(error){
        console.log("Error in GetUser Data", error);
    }finally{
        setIsCheckingAuth(false);
    }
  }


  const getAuthStatus = async ()=>{
      try{
          // axios.defaults.withCredentials = true;
          // const {data} = await axios.get(`${backEndURL}/api/auth/authCheck`);
          // console.log("Data from getAuthStatus ",data);

          setIsCheckingAuth(true);    // This is just for Loading state
          
          const fetchOptions = {
              method:"GET",
              credentials:"include",
          }
          const response = await fetch(`${backEndURL}/api/auth/authCheck`,fetchOptions);
          const data = await response.json();
          // console.log("Data from getAuthStatus ",data);
          if(data.success){
              setIsLoggedIn(true);
              getUserData();
              // connectSocket();
              // console.log("User Data is ",userData);
          }
  
      }catch(error){
          console.log("Error While checking 'getAuthStatus' ",error);
      }finally{
          setIsCheckingAuth(false);
      }
  }
  
  /**
   * Socket IO functions
   */

  const [socketState,setSocketState] = useState(null);
  


  // useEffect(()=>{ 

  // },[]);


  

  const connectSocket = ()=>{

    // if(!isLoggedIn){  // If User Is not authenticated don't connect only
    //   return;
    // }

    // if (socketState?.connected || !userData?.userId) return;

    if(socketState?.connected) return;
    console.log("User Data in connectSocket",userData);
    const socket = io(backEndURL, {
      query:{
        userId:userData.userId,
      },
      withCredentials:true,
    })
    socket.connect();
    setSocketState(socket);

    socket.on("getOnlineUsers",(userIds)=>{
      console.log("Inside socket.on ",userIds);
        setOnlineUsers(userIds);
    })

  }

  const disConnectSocket = ()=>{
    // socketState.disconnect();
    if(socketState?.connected){ 
      socketState.disconnect();
    }

  }

  const listenToMessages = ()=>{
    if(!selectedUser){
      return;
    }
    socketState.on("newMessage",(newMessage)=>{

      // if(newMessage.senderId!==selectedUser.userId) return;


      setMessages((prev)=>{
        return [...prev,newMessage];
      })
    })
  }

  const unLitenToMessages = ()=>{
      socketState?.off("newMessage");
  }


  useEffect(()=>{ 
    if(userData && userData.userId){
      connectSocket();
    }
  },[userData]);




  /**
   * 
   * Setting The Themes
   */


  const [theme,setTheme] = useState(localStorage.getItem('color-theme')|| "coffee");

  /**
   * 
   * Chat States
   * 
   */

    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);

    const [onlineUsers,setOnlineUsers] = useState([]);



    const [isUserLoading,setIsUserLoading] = useState(false);
    const [isMessagesLoading,setIsMessagesLoading] = useState(false);


  
  const value = {
    userData,setUserData,
    isLoggedIn,setIsLoggedIn,
    isCheckingAuth,
    getAuthStatus,
    backEndURL,

    theme,setTheme,

    messages,setMessages,users,setUsers,selectedUser,setSelectedUser,
    isUserLoading,setIsUserLoading,isMessagesLoading,setIsMessagesLoading,onlineUsers,setOnlineUsers,

    socketState,connectSocket,disConnectSocket,
    listenToMessages,unLitenToMessages

  }






































  useEffect(()=>{ 
    // console.log(value.userData);
    getAuthStatus();
  },[]);


  
  // useEffect(()=>{
  //   if(isLoggedIn){
  //     navigate("/");
  //   }
  // },[userData])



  if(isCheckingAuth){
    return <div className='flex items-center justify-center h-screen'> 
        <Loader className="size-10 animate-spin"/>
    </div>
  }

  return(
    <>
    <div data-theme={theme}>

         <AppContext.Provider value={value}>


          <Navbar/>

          <Routes>
            <Route path='/' element={ userData? <Home/> : <Navigate to="/signUp"/> } />
            <Route path='/signUp' element={ !userData ? <SignUp/>: <Navigate to='/'/> }/>
            <Route path='/settings' element={  <Settings/> }/>
            <Route path='/profile' element={ <Profile/>  }/>
          </Routes>

          <Toaster/>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />

         </AppContext.Provider>

    </div>
    </>
  )
}

export default App;

export { AppContext };


export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];