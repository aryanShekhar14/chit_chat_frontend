import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { color } from 'framer-motion';
import { getSender } from '../../config/ChatLogic';
import GroupChatModal from './GroupChatModal';
import ChatLoading from './ChatLoading';

const MyChats = ({ fetchAgain }) => {
  const [loading, setloading] = useState(false)
  const [loggedUser, setloggedUser] = useState()
  const { user, setselectedChat, chats, setchats, selectedChat } = ChatState();

  const toast = useToast()

  const fetchChats = async () => {
    try {
      setloading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      }
      const { data } = await axios.get("https://chit-chat-backend-4cal.onrender.com/api/chat", config)
      // console.log(data)
      setchats(data)
      setloading(false)

    } catch (error) {
      toast({
        title: 'Something Unexpected Occured:)',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])


  return (
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDirection={'column'} alignItems={"center"} p={3} bg={"antiquewhite"} w={{ base: "100%", md: "31%" }} borderRadius={"15"} borderWidth={"1px"}>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} w={"100%"} pb={3} px={3} fontSize={{ base: "20px", md: "30px" }} fontFamily={"sans-serif"}>My Chit-Chats <GroupChatModal>
        <Button display={"flex"} fontSize={"small"} bg={"purple"} color={"white"} _hover={{ background: "pink", color: "black" }} leftIcon={<AddIcon />}>Create
        </Button>
      </GroupChatModal>
      </Box>
      <Box display={"flex"} flexDirection={"column"} padding={3} bg={"antiquewhite"} w={"100%"} h={"100%"} borderRadius={"15"} overflowY={"hidden"} >
        {loading ? <Spinner  size={"md"}  emptyColor="pink"
          color="purple"></Spinner> : ""}
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box onClick={() => setselectedChat(chat)} cursor={"pointer"} bg={selectedChat === chat ? "purple" : "pink"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} borderRadius={"15"} key={chat._id} _hover={{ bg: "purple", color: "white" }}>
                <Text fontFamily={"sans-serif"}>{!chat.isGroupChat ? (
                  getSender(loggedUser, chat.users)
                ) : (chat.chatName)}</Text>
              </Box>
            ))}
          </Stack>
        ) : (<ChatLoading/>)}
      </Box>
    </Box>
  )
}

export default MyChats