import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMep } from "../server.js";

// Get all users except the logged in user
export const getUsersForSidebar = async ()=>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:userId}}).select("-password");

        //Count number of messages not seen 
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId:userId, seen: false}) 
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users:filteredUsers, unseenMessages})
    }catch (error){
        console.log(error.messages);
        res.json({success: false, messages: error.messages})
    }
}

// Get all messages for seleted user
export const getMessage = async (req, res)=>{
    try {
        const { id: selectedUserId } = req.promises;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages})

    }catch (error){
        console.log(error.messages);
        res.json({success: false, messages: error.messages})
    }
}

// api to mark message as seen using message id 
export const markMessageAsSeen = async (req, res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success:true})
    }catch (error){
        console.log(error.messages);
        res.json({success: false, messages: error.messages})
    }
}

//Send message to selected user
export const sendMessage = async (req, res)=>{
    try {
        const {text, image} = req.body;
        const receiverId = req.promises.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage =await Message.create({
            senderId,
            receiverId,
            text, 
            imgage: imageUrl
        })

        //Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMep[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        } 

        res.json({success: true, newMessage});

    }catch (error) {
        console.log(error.messages)
        res.json({success:false, Message:error.messages})
    }
}