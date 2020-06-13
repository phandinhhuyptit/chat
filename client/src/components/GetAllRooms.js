import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ListGroup, Button, Form } from "react-bootstrap";

const GET_ROOMS = gql`
  query {
    ChatRooms {
      chatRoomId
      name
    }
  }
`;

const CREATE_ROOM = gql`
  mutation createChatRoom($input: ChatRoomInput!) {
    createChatRoom(input: $input) {
      chatRoomId
      name
    }
  }
`;

function GetAllRooms(props) {
  const { loading, error, data } = useQuery(GET_ROOMS);
  const [roomName, changeRoomName] = useState();
  const [rooms, updateRooms] = useState([]);
  const [createChatRoom] = useMutation(CREATE_ROOM, {
    update(cache, { data: { createChatRoom } }) {
      updateRooms([...rooms, createChatRoom]);
      changeRoomName(null);
    },
  });

  useEffect(() => {
    if (data && data.ChatRooms) {
      updateRooms(data.ChatRooms);
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
      <h5>All chat rooms</h5>
      <ListGroup>
        {rooms.map((item) => {
          return (
            <ListGroup.Item
              active={props.currentRoom === item.chatRoomId ? true : false}
              onClick={() => props.updateCurrentRoom(item.chatRoomId)}
              key={item.chatRoomId}
            >
              {item.name}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <br />
      <b>Create new room:</b>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            onChange={(e) => changeRoomName(e.target.value)}
            type="text"
            placeholder="Input name"
          />
        </Form.Group>
        <Button
          onClick={(e) => {
            e.preventDefault();
            createChatRoom({
              variables: {
                input: {
                  chatRoomId: new Date().valueOf().toString(),
                  name: roomName,
                },
              },
            });
          }}
          variant="secondary"
          type="button"
        >
          Create
        </Button>
      </Form>
    </div>
  );
}

export default GetAllRooms;
