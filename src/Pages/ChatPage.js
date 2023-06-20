import React, { useEffect, useState } from 'react'
import { ChatState } from "../context/ChatProvider"
import { Box } from "@chakra-ui/react"
import SideDrawer from '../components/miscellaneous/NavBar'
import MyChats from '../components/miscellaneous/MyChats'
import ChatBox from '../components/miscellaneous/ChatBox'
const ChatPage = () => {
    // window.location.reload();
    const { user, setuser } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)

    })
    return (
        <div style={{
            width
                : "100%"
        }}>
            {user && <SideDrawer />}

            <Box
                justifyContent={"space-between"} display={"flex"} w={"100%"} h={"91.5vh"} p={"10px"}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>

        </div>
    )
}

export default ChatPage