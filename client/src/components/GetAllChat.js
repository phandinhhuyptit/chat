import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { Jumbotron, Button, Form } from "react-bootstrap";

const GET_CHAT = gql`
  query ChatHistoryByRoom($chatRoomId: String) {
    ChatHistoryByRoom(chatRoomId: $chatRoomId) {
      mesageId
      content
      user {
        userId
        name
      }
      roomId
    }
  }
`;

const SEND_CHAT = gql`
  mutation sendMessageByRoom($input: SendMessageInput!) {
    sendMessageByRoom(input: $input) {
      mesageId
      content
      user {
        userId
        name
      }
    }
  }
`;

const SUB_CHAT = gql`
  subscription messageRealtimeByRoom($roomId: String!) {
    messageRealtimeByRoom(roomId: $roomId) {
      mesageId
      content
      user {
        userId
        name
      }
      roomId
    }
  }
`;

function GetAllChat(props) {
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatRoomId: props.currentRoom },
  });
  const [messages, updateMessages] = useState([]);
  const [message, setMessage] = useState();

  const [sendMessageByRoom] = useMutation(SEND_CHAT);

  // useEffect(() => {
  //   if (props.currentRoom) {
  //     const unsubscribe = subscribeToMore({
  //       document: SUB_CHAT,
  //       variables: { roomId: props.currentRoom },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         updateMessages([
  //           ...messages,
  //           subscriptionData.data.messageRealtimeByRoom,
  //         ]);
  //         setMessage(null);
  //       },
  //     });
  //     return () => unsubscribe();
  //   }
  // }, [props.currentRoom, messages]);

  useSubscription(SUB_CHAT, {
    variables: { roomId: props.currentRoom },
    onSubscriptionData({ subscriptionData }) {
      updateMessages([
        ...messages,
        subscriptionData.data.messageRealtimeByRoom,
      ]);
    },
  });

  useEffect(() => {
    if (data && data.ChatHistoryByRoom) {
      updateMessages(data.ChatHistoryByRoom);
    }
  }, [data]);

  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <h5>Room Id: {props.currentRoom}</h5>
      {props.currentRoom && (
        <div>
          <Jumbotron>
            {messages.map((item) => {
              return (
                <div>
                  {item.user.userId === props.currentUser ? (
                    <div
                      key={item.content}
                      style={{ marginBottom: "10px", textAlign: "right" }}
                    >
                      <b>You</b>: <span>{item.content}</span>
                    </div>
                  ) : (
                    <div key={item.content} style={{ marginBottom: "10px" }}>
                      <b>{item.user.name}</b>: <span>{item.content}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </Jumbotron>
          <p>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={(e) => setMessage(e.target.value)}
                as="textarea"
                rows="3"
              />
            </Form.Group>
            <Button
              onClick={(e) => {
                e.preventDefault();
                sendMessageByRoom({
                  variables: {
                    input: {
                      mesageId: new Date().valueOf().toString(),
                      content: message,
                      userId: props.currentUser,
                      roomId: props.currentRoom,
                    },
                  },
                });
              }}
              variant="secondary"
            >
              Send
            </Button>
          </p>
        </div>
      )}
    </div>
  );
}

export default GetAllChat;
