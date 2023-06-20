import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useHistory } from "react-router-dom"

const Login = () => {
    const [show, setshow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory();

    const handleClick = () => {
        setshow(!show);
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please provide all the details",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("https://chit-chat-backend-4cal.onrender.com/api/user/login", { email, password }, config);
            toast({
                title: "Welcome back!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            
            history.push("/chats")
            
        } catch (error) {
            toast({
                title: "Sorry! An unexpected error occured:(",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    }


    return (
        <VStack spacing={"5px"} color={"black"}>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    backgroundColor={"white"} value={email} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size={"md"}>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        backgroundColor={"white"}
                        value={password} />
                    <InputRightElement>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>

            <Button colorScheme='pink' width={"50%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Login!
            </Button>
            <Button colorScheme='purple' width={"50%"} style={{ marginTop: 15 }} onClick={() => {
                setEmail("guest@chitchat.com");
                setPassword("chitchat");
            }}>
                Guest Login!
            </Button>

        </VStack>

    )
}

export default Login