import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import Typewriter from "typewriter-effect";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogic'
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './styles.css'
import axios from 'axios';
import ScrollChat from './ScrollChat';
import io from "socket.io-client"
import animationData from "../../animation/typing.json"
import animationData2 from "../../animation/waiting.json"

import Lottie from "react-lottie"


const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setselectedChat , notification, setNotification} = ChatState()

    const toast = useToast()

    const [newMessage, setnewMessage] = useState("")

    const [messages, setmessages] = useState([])

    const [loading, setloading] = useState(false)

    const [socketConnected, setSocketConnected] = useState(false)

    const [typing, settyping] = useState(false)

    const [isTyping, setisTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const defaultOptions2 = {
        loop: true,
        autoplay: true,
        animationData: animationData2,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessage = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setloading(true)
            const { data } = await axios.get(`https://chit-chat-backend-4cal.onrender.com/api/message/${selectedChat._id}`, config)


            setmessages(data)
            setloading(false)

            socket.emit("join chat", selectedChat._id)
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

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                setnewMessage("");
                const { data } = await axios.post('https://chit-chat-backend-4cal.onrender.com/api/message/', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                

                socket.emit("new msg", data)
                setmessages([...messages, data])

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
    }

    const typingHandler = (e) => {
        setnewMessage(e.target.value)

        // typing indicator
        if (!socketConnected) return

        if (!typing) {
            settyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();

        var timerLength = 3000

        setTimeout(() => {
            var timeNow = new Date().getTime()

            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                settyping(false)

            }
        }, timerLength);
    }



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setisTyping(true))
        socket.on("stop typing", () => setisTyping(false))
    }, [])

    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat])//when user changes chat

    useEffect(() => {
        socket.on("msg received", (newMessageRecv) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecv.chat._id) {
                //if no chat selected or selected chat is not chat opened 

                //give a NOTIFICATION
                if(!notification.includes(newMessageRecv)){
                    setNotification([newMessageRecv,...notification])
                    setFetchAgain(!fetchAgain)
                }

            }
            else {
                setmessages([...messages, newMessageRecv])
            }
        })
    })






    return (<>
        {selectedChat ? (
            <>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3}
                    px={2}
                    w={"100%"}
                    fontFamily={"sans-serif"} display={'flex'} justifyContent={{ base: "space-between" }} alignItems={"center"}>

                    <IconButton display={{ base: 'flex', md: "none" }} icon={<ArrowBackIcon />} onClick={() => setselectedChat("")} bg={"purple"} color={"white"} _hover={{ background: "pink", color: "black" }} />

                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                                fetchMessage={fetchMessage} />
                        </>
                    )}

                </Text>
                <Box display={"flex"} flexDir={"column"} p={3} bg={"antiquewhite"} w={"100%"} h={"100%"} justifyContent={"flex-end"} borderRadius={"15px"} overflowY={"hidden"}>
                    {loading ? (<Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor="pink"
                        color="purple"
                        size='xl'
                        alignItems={"center"} margin={"auto"}
                    />) : (
                        <div className='messages'>
                            <ScrollChat messages={messages} />
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} mt={4} isRequired>
                        {isTyping ? <div><Lottie
                            options={defaultOptions}
                            // height={50}
                            width={70}
                            style={{ marginBottom: 15, marginLeft: 0 }}
                        /></div> : <></>}
                        <Input placeholder='Send Something...' borderColor={"purple"} borderRadius={"15px"} borderWidth={"2px"} onChange={typingHandler} value={newMessage} />

                    </FormControl>
                </Box>
            </>
        ) : <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}><Text fontSize={"4xl"} pb={3} fontFamily={"sans-serif"}>
            {/* <Typewriter

                onInit={(typewriter) => {

                    typewriter

                        .typeString("Nothing to Show")

                        .pauseFor(500)
                        .deleteAll()
                        .typeString("Click on a Chit-Chat to show")
                        .start();
                }}
            /> */}
            <Lottie
                options={defaultOptions2}
                
            />
        </Text>

        </Box>}
    </>)

}

export default SingleChat