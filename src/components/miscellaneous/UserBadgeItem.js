import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box px={2}
            py={1}
            borderRadius={"10px"}
            m={1}
            mb={2}
            color={"white"}
            fontSize={13}
            bg={"purple"}
            cursor={"pointer"}
            onClick={handleFunction}>

            {user.name}
            <CloseIcon pl={2} />
        </Box>
    )
}

export default UserBadgeItem