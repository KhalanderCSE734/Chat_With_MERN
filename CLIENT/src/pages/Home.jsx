import React, { useContext } from 'react'
import { AppContext } from '../App'


import SideBar from '../components/SideBar'
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';


const Home = () => {

  const { backEndURL, userData,
     messages,setMessages,users,setUsers,selectedUser,setSelectedUser,
    isUserLoading,setIsUserLoading,isMessagesLoading,setIsMessagesLoading, } = useContext(AppContext);




  return (
    <div className='mainContainer'>
        <SideBar/>
        {
          !selectedUser?
          <NoChatSelected/>:
          <ChatContainer/>

        }
    </div>
  )
}

export default Home