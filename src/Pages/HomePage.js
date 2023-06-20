import React from 'react'
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import Typewriter from "typewriter-effect";
import {useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const HomePage = () => {
  const history=useHistory()
    useEffect(() => {
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))


        if(userInfo){
            history.push("/chats")
        }
    }, [history])


  return (
    <Container maxW='x1' centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"antiquewhite"}
        w={"50%"}
        margin="40px 0 15px 0"
        borderRadius={"10px"}
        borderWidth={"2px"}
        shadow={"dark-lg"}
      >
        <Text fontSize={"4xl"} fontFamily={"sans-serif"} fontWeight={"bold"} color={"black"}><Typewriter

          onInit={(typewriter) => {

            typewriter

              .typeString("CHIT-CHAT")

              .pauseFor(1000)
              .deleteAll()
              .typeString("CHIT-CHAT")
              .start();
          }}
        /></Text>
      </Box>
      <Box bg={"antiquewhite"} w={'50%'} p={4} borderRadius={"10px"} borderWidth={"2px"} shadow={"dark-lg"}>
        <Tabs variant='soft-rounded' colorScheme="pink">
          <TabList marginBlock={"1em"}>
            <Tab _selected={{shadow:"2xl", backgroundColor:"pink"}} width={"50%"}>Login</Tab>
            <Tab _selected={{shadow:"2xl", backgroundColor:"pink"}} width={"50%"}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage