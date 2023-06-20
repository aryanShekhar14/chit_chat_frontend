import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span>
                : (<IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} backgroundColor={"purple"} color={"white"} _hover={{backgroundColor:"antiquewhite", color:"black"}}/>)}
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
                <ModalOverlay />
                <ModalContent bg={"antiquewhite"} >
                    <ModalHeader fontFamily={"sans-serif"} fontSize={"20px"} marginTop={"10px"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"space-between"}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"space-between"}>
                        <Image borderRadius={"full"} boxSize={"150px"} src={user.pic} alt={user.name} />
                        <Text fontFamily={"sans-serif"} fontSize={"20px"} marginTop={"10px"}>Email: {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg={"pink.900"} colorScheme='blue' mr={3} onClick={onClose} _hover={{ bg: "pink", color:"black" }} borderRadius={"15"} >
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal