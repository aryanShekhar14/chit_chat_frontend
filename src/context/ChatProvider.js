import { createContext, useContext } from 'react'
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
const ChatContext = createContext()
const ChatProvider = ({ children }) => {
    const [user, setuser] = useState()//this usestate will be accessable wherever we use context

    const [selectedChat, setselectedChat] = useState()

    const [chats, setchats] = useState([])

    const history = useHistory()

    const [notification, setNotification] = useState([])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)

        if (!userInfo) {
            history.push("/")
        }
    }, [history])

    return (
        <ChatContext.Provider value={{ user, setuser, selectedChat, setselectedChat, chats, setchats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext)
}


export default ChatProvider;

