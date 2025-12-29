import { useState, useContext, createContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // get users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // get messages
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // send message
const sendMessage = async (messageData) => {
  if (!selectedUser) {
    return toast.error("Select a user first");
  }

  if (!messageData?.text || messageData.text.trim() === "") {
    return toast.error("Message cannot be empty");
  }

  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );

    if (data.success) {
      setMessages((prev) => [...prev, data.newMessage]);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


const subscribeToMessages = () => {
  if (!socket) return;

  socket.off("newMessage");

  socket.on("newMessage", async (newMessage) => {
  
    if (
      selectedUser &&
      String(newMessage.senderId) === String(selectedUser._id)
    ) {
      // mark as seen
      newMessage.seen = true;

      setMessages((prev) => [...prev, newMessage]);

      try {
        await axios.put(`/api/messages/mark/${newMessage._id}`);
      } catch (err) {
        console.log("Failed to mark message as seen");
      }
    } else {
      // sidebar unseen count update
      setUnseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }));
    }
  });
};


  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
