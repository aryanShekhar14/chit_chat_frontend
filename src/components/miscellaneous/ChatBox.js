import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const { selectedChat } = ChatState()
  return (
    <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }} 
    alignItems={"center"}
    flexDir={"column"}
    p={3}
    bg={"pink.100"}
    w={{base:"100%", md:"65%"}}
    borderRadius={"15px"}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )

}

export default ChatBox