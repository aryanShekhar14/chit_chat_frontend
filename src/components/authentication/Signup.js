import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useHistory } from "react-router-dom"

const Signup = () => {

    const [show, setshow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [password, setPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory();


    const handleClick = () => {
        setshow(!show);
    }



    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please add a picture!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chit_chat")
            data.append("cloud_name", "dy5syuaz7")
            axios.post("https://api.cloudinary.com/v1_1/dy5syuaz7/image/upload", data)
                .then((response) => {
                    console.log("Cloudinary response:", response);
                    setPic(response.data.url.toString());
                    setLoading(false);
                    toast({
                        title: "Image uploaded successfully!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                })
                .catch((error) => {
                    console.log("Cloudinary error:", error);
                    setLoading(false);
                });
        }

        else {
            toast({
                title: 'Please add a picture!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };



    const submitHandler = async (pics) => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
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
        if (password !== confirmpassword) {
            toast({
                title: "Please enter same password",
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
            const { data } = await axios.post("https://chit-chat-backend-4cal.onrender.com/api/user", { name, email, password, pic }, config);
            toast({
                title: "User profile created!",
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
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                    backgroundColor={"white"} />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    backgroundColor={"white"} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size={"md"}>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        backgroundColor={"white"} />
                    <InputRightElement>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size={"md"}>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        backgroundColor={"white"} />
                    <InputRightElement>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>
            <FormControl id="pic" isRequired>
                <FormLabel>Add Profile Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                    backgroundColor={"white"} />

            </FormControl>
            <Button colorScheme='pink' width={"50%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                SignUp!
            </Button>

        </VStack>

    )
}

export default Signup