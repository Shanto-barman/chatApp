import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";


const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [imageToSend, setImageToSend] = useState(null);

  // Send text + optional image
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() && !imageToSend) {
      toast.error("Message cannot be empty");
      return;
    }

    await sendMessage({ text: input.trim(), image: imageToSend });
    setInput("");
    setImageToSend(null);
  };

  // Handle sending an image
  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToSend(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.senderId === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Profile pic*/}
            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full"
              />
            )}

            <div className={`flex flex-col max-w-[200px]`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg mb-1"
                />
              ) : (
                <div
                  className={`p-2 md:text-sm font-light rounded-lg 
            break-all bg-violet-500/30 text-white
            ${
              msg.senderId === authUser._id
                ? "rounded-br-none"
                : "rounded-bl-none"
            }`}
                >
                  <p>{msg.text}</p>
                </div>
              )}

              {/* Time */}
              <span className="text-xs text-gray-300 self-end mt-1">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom input */}
      <form
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3"
      >
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />

          <input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            id="image"
            onChange={handleSendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="upload"
              className="w-5 h-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

     <button
  type="submit"
  className="flex items-center hover:scale-110 transition-all duration-200 cursor-pointer p-2 rounded-full"
>
  <img src={assets.send_button} alt="send" className="w-6 h-6" />
</button>
      </form>
    </div>
  );
};

export default ChatContainer;
