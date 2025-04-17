

import { useRef, useState, useContext } from "react";


import { Image, Send, X } from "lucide-react";

import { AppContext } from "../App";



const MessageInput = () => {

    const [text,setText] = useState("");
    const [imagePreview,setImagePreview] = useState("");
    const fileInputRef = useRef(null);

    const { selectedUser,messages,setMessages } = useContext(AppContext);



    const handleImageChange = async(evt)=>{
        let file = evt.target.files[0];

        if(!file){
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

       reader.onloadend = ()=>{
        setImagePreview(reader.result);
       }
      //  reader.readAsDataURL(file);

    }


    const removeImage = ()=>{
        setImagePreview(null);
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    }


    const sendMessage = async(evt)=>{

        evt.preventDefault();

        if(!text.trim() && !imagePreview){
            return;
        }
 

        try{
            const fetchOptions = {
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({text:text.trim(),image:imagePreview}),
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send/${selectedUser._id}`,fetchOptions);
            const data = await response.json();

         
            console.log("Data After sending Message ",data);

            if(data.success){
                console.log("Message Send SuccessFully");
                setText("");
                setImagePreview(null);
                if(fileInputRef.current){
                    fileInputRef.current.value = "";
                }
                setMessages((prev)=>{
                    return [...prev,data.message]
                })
            }else{
                console.log("Error In Sending message ",data.message);
            }



        }catch(error){
            console.log("Error While Sending The Message ", error);
        }
    }

    

  return (
    <div className="p-4 w-full" style={{padding:"0px 5px"}}>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form className="flex items-center gap-2" onSubmit={sendMessage}>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(evt)=>{ setText(evt.target.value) }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                    ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={()=>{ fileInputRef.current?.click() }}
          >
             
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
          >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;