import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain , fetchMessage}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { user, selectedChat, setselectedChat } = ChatState()

  const [grpChatName, setgrpChatName] = useState()

  const [search, setsearch] = useState("")

  const [searchResults, setsearchResults] = useState([])

  const [loading, setloading] = useState(false)

  const [renameLoading, setrenameLoading] = useState(false)

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'You are not permitted to add someone in space',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put("https://chit-chat-backend-4cal.onrender.com/api/chat/groupremove", { chatId: selectedChat._id, userId: user1._id }, config)

      user1._id === user._id ? setselectedChat() : setselectedChat(data);

      setFetchAgain(!fetchAgain)
      fetchMessage();
      setloading(false)
    } catch (error) {
      toast({
        title: 'Something Unexpected Occured:)',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false)
    }
  }

  const handleRename = async () => {
    if (!grpChatName) return

    try {
      setrenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put("https://chit-chat-backend-4cal.onrender.com/api/chat/rename", { chatId: selectedChat._id, chatName: grpChatName }, config)

      setselectedChat(data)
      setFetchAgain(!fetchAgain)
      setrenameLoading(false);
      sethide(true)
      toast({
        title: 'Space name updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });


    } catch (error) {
      toast({
        title: 'Something Unexpected Occured:)',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setrenameLoading(false)

      setgrpChatName("")

    }
  }

  const handleSearch = async (query) => {
    setsearch(query)
    if (!query) {
      return;
    }
    try {
      setloading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      }

      const { data } = await axios.get(`https://chit-chat-backend-4cal.onrender.com/api/user?search=${search}`, config)
      setloading(false)
      setsearchResults(data);

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

  const handleAdd = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'Person already part of space',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'You are not permitted to add someone in space',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      }
      const { data } = await axios.put('https://chit-chat-backend-4cal.onrender.com/api/chat/groupadd', { chatId: selectedChat._id, userId: user1._id }, config)

      setselectedChat(data)
      setFetchAgain(!fetchAgain)
      setloading(false)

    } catch (error) {
      toast({
        title: 'Something Unexpected Occured:)',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false)
    }
  }

  const [hide, sethide] = useState(true)

  const toast = useToast()

  return (
    <>
      <IconButton backgroundColor={"purple"} color={"white"} _hover={{ backgroundColor: "antiquewhite", color: "black" }} display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent backgroundColor={"antiquewhite"}>
          <ModalHeader fontSize={"34px"} fontFamily={"sans-serif"} display={"flex"} justifyContent={"center"}>{selectedChat.chatName}<Button backgroundColor={"antiquewhite"} _hover={{ backgroundColor: "antiquewhite" }} _active={{ backgroundColor: "antiquewhite" }} mx={3} px={3} onClick={() => sethide(false)}  ><i fontSize="2px" class="fa-solid fa-pen-to-square"></i></Button></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
          <FormControl p={6} display={hide ? "none" : "flex"}>
            <Input placeholder='New Space Name' mb={3} value={grpChatName} onChange={(e) => setgrpChatName(e.target.value)} />
            <Button marginLeft={3} bg={"purple"} color={"white"} _hover={{ background: "pink", color: "black" }} isLoading={renameLoading} onClick={handleRename}>Update</Button>

          </FormControl>
          <Box justifyContent={"center"} display={"flex"} flexWrap={"wrap"}>
            {selectedChat.users.map(u => (
              <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
            ))}
          </Box>
          <FormControl>
            <Input placeholder='Add People to Space' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            {loading ? <Spinner></Spinner> : (searchResults?.slice(0, 4).map(user => (
              <UserListItem key={user._id} user={user} handleFunction={() => handleAdd(user)} />
            )))}
          </FormControl>

          <ModalFooter>
            <Button bg={"purple"} color={"white"} _hover={{ background: "pink", color: "black" }} mr={3} onClick={() => handleRemove(user)}>
              Leave Space
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal