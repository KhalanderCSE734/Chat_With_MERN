import { X } from "lucide-react";


import React from 'react';

import { useContext } from "react";
import { AppContext } from "../App";



const ChatHeader = () => {

    const { selectedUser,setSelectedUser,onlineUsers } = useContext(AppContext);



  return (
    <div className="p-2.5 border-b border-base-300" style={{width:"100%",height:"50px"}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/user.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} style={{cursor:"pointer",paddingRight:"10px"}}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;