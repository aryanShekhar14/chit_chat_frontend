import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import React from 'react'
import Typewriter from "typewriter-effect";
import { useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { getSender } from '../../config/ChatLogic';
import NotificationBadge, { Effect } from 'react-notification-badge'

const SideDrawer = () => {
    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState()

    const { user, setselectedChat, chats, setchats, notification, setNotification } = ChatState();

    const history = useHistory();

    const logOutHandle = () => {
        localStorage.removeItem("userInfo");
        history.push("/")
    }
    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please add something to search',
                status: 'warning',
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
            const { data } = await axios.get(`https://chit-chat-backend-4cal.onrender.com/api/user?search=${search}`, config)

            setloading(false)
            setsearchResult(data)
        }
        catch (error) {
            toast({
                title: 'Something Unexpected Occured:)',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setloadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },

            }

            const { data } = await axios.post("https://chit-chat-backend-4cal.onrender.com/api/chat", { userId }, config)

            if (!chats.find((c) => c._id === data.id)) setchats([data, ...chats]) //adding new chat to existing chats

            setselectedChat(data); setloadingChat(false);
            onClose()

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


    return (
        <>
            <Box display={"flex"} justifyContent={"space-between"}
                alignItems={"center"}
                bg="antiquewhite"
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"2px"} borderRadius={"15"}>
                <Tooltip label="Search People" hasArrow placement='bottom-end'>

                    <Button variant="ghost" _hover={{ bg: "pink" }} borderRadius={"15"} onMouseEnter={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} padding={"10px"}>Search People</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"sans-serif"} fontWeight={"bold"}><Typewriter

                    onInit={(typewriter) => {

                        typewriter

                            .typeString("CHIT-CHAT")

                            .pauseFor(1000)
                            .deleteAll()
                            .typeString("CHIT-CHAT")
                            .start();
                    }}
                /></Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification.length}
                                effect={Effect.SCALE} />
                            <BellIcon fontSize={"2xl"} margin={2} color={"purple"} />
                        </MenuButton>
                        <MenuList p={1} borderRadius={"15px"} backgroundColor={"purple"} display={"flex"} justifyContent={"center"} color={"white"} flexDir={"column"} >
                            {!notification.length && <center>No new Chit-Chats</center>}
                            {notification.map(notif => (
                                <MenuItem borderRadius={"15px"} backgroundColor={"purple"} color={"white"} _hover={{ color: "black", backgroundColor: "antiquewhite", transform: 'scale(0.98)' }} key={notif._id} fontWeight={"bold"} onClick={() => {
                                    setselectedChat(notif.chat)
                                    setNotification(notification.filter((n) => n !== notif))
                                }
                                }>
                                    {notif.chat.isGroupChat ? `New Chit-Chat in ${notif.chat.chatName}` : `New Chit-Chat from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" _hover={{ bg: "pink" }} borderRadius={"15"} _active={{
                            bg: "antiquewhite",
                            transform: 'scale(0.98)',
                            borderColor: '#bec3c9',
                        }}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList marginTop={"10px"} bg={"purple"} borderRadius={"15"} _hover={{
                            bg: "purple",
                            transform: 'scale(0.98)',
                        }}>
                            <ProfileModal user={user}>

                                <MenuItem bg={"purple"} color={"white"} borderRadius={"15"} _hover={{
                                    bg: "antiquewhite",
                                    color: "black",
                                    transform: 'scale(0.98)',
                                }}>About Me</MenuItem >

                            </ProfileModal>

                            <MenuItem bg={"purple"} color={"white"} borderRadius={"15"} _hover={{
                                bg: "antiquewhite",
                                color: "black",
                                transform: 'scale(0.98)',
                            }} onClick={logOutHandle}>LogOut</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent onMouseLeave={onClose} bg={"antiquewhite"}>
                    <DrawerHeader borderBottomWidth={"1px"}>Search People

                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input placeholder='Name or Email' marginRight={2} value={search} borderColor={"purple"} borderRadius={"15px"} borderWidth={"2px"} onChange={(e) => {
                                setsearch(e.target.value)
                            }} />
                            <Button

                                onClick={handleSearch}

                                bg={"purple"} colorScheme='blue' mr={3} _hover={{ bg: "pink", color: "black" }} borderRadius={"15"}>Search</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (

                            searchResult?.map(user => (<UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />))
                        )}

                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer