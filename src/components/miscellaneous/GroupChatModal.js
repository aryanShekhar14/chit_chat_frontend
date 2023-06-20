import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, chats, setchats } = ChatState()

    const [grpChatName, setgrpChatName] = useState()

    const [selectedUsers, setselectedUsers] = useState([]);

    const [search, setsearch] = useState("")

    const [searchResults, setsearchResults] = useState([])

    const [loading, setloading] = useState(false)

    const toast = useToast();

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
    const handleSubmit = async () => {
        if (!grpChatName || !selectedUsers) {
            toast({
                title: 'Please provide all the details',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },

            }

            const { data } = await axios.post("https://chit-chat-backend-4cal.onrender.com/api/chat/group", {
                name: grpChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config)

            setchats([data, ...chats])//new chat added at the top

            onClose();
            toast({
                title: 'Chit-Chat Space created successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: 'Failed to create Chit-Chat Space',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            // console.log(error);
        }
    }

    const handleGroup = (AddUser) => {
        if (selectedUsers.includes(AddUser)) {
            toast({
                title: 'Person already added in space',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        setselectedUsers([...selectedUsers, AddUser])
    }

    const handleDelete = (deleteUser) => {
        setselectedUsers(selectedUsers.filter(sel => sel._id !== deleteUser._id))
    }



    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={"antiquewhite"} >
                    <ModalHeader fontFamily={"sans-serif"} display={"flex"} justifyContent={"center"} fontWeight={"bold"}>Create Chit-Chat Space</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} alignItems={"center"} flexDirection={"column"}>
                        <Box w={"100%"} flexWrap={"wrap"} display={"flex"}>
                            {selectedUsers.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}

                        </Box>

                        <FormControl>
                            <Input placeholder='Space Name' mb={3} onChange={(e) => setgrpChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add People' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>



                        {loading ? <Spinner></Spinner> : (searchResults?.slice(0, 4).map(user => (
                            <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                        )))}

                    </ModalBody>

                    <ModalFooter>
                        <Button fontSize={"small"} bg={"purple"} color={"white"} _hover={{ background: "pink", color: "black" }} mr={3} onClick={handleSubmit}>
                            Create Space
                        </Button >
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal