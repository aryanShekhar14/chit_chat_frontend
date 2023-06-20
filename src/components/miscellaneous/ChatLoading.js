import { Box, Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
    return (
        <>
            <SkeletonCircle size='10' marginTop={"15px"}/>
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
            <SkeletonCircle size='10' marginTop={"15px"}/>
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </>



    )
}

export default ChatLoading