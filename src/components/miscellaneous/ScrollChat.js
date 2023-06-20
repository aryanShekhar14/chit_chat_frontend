import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSenderMargin, isSameUser, lastMessageCheck, sameSenderCheck } from '../../config/ChatLogic'
import { ChatState } from '../../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'
const ScrollChat = ({ messages }) => {
  const { user } = ChatState()
  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {
            (sameSenderCheck(messages, m, i, user._id) || lastMessageCheck(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                <Avatar mr={1} mt={"8px"} size={"sm"} cursor={"pointer"} name={m.sender.name} src={m.sender.pic} />
              </Tooltip>
            )
          }
          <span style={{
            backgroundColor: `${m.sender._id === user._id ? "#0d7082" : "#d14c28"}`,
            color: "white", marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10, borderRadius: "15px", padding: "5px 15px", maxWidth: "75%",
          }}>
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollChat