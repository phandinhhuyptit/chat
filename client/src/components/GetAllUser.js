import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ListGroup, Button, Form } from "react-bootstrap";

const GET_USERS = gql`
  query {
    Users {
      userId
      name
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      userId
      name
    }
  }
`;

function GetAllUser(props) {
  const { loading, error, data } = useQuery(GET_USERS);
  const [userName, changeUserName] = useState();
  const [users, updateUsers] = useState([]);
  const [createUser] = useMutation(CREATE_USER, {
    update(cache, { data: { createUser } }) {
      updateUsers([...users, createUser]);
      changeUserName(null);
    },
  });

  useEffect(() => {
    if (data && data.Users) {
      updateUsers(data.Users);
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <h5>All Users</h5>
      <ListGroup>
        {users.map((item) => {
          return (
            <ListGroup.Item
              active={props.currentUser === item.userId ? true : false}
              onClick={() => props.updateCurrentUser(item.userId)}
              key={item.userId}
            >
              {item.name}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <br />
      <b>Create new user:</b>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            onChange={(e) => changeUserName(e.target.value)}
            type="text"
            placeholder="Input username"
          />
        </Form.Group>
        <Button
          onClick={(e) => {
            e.preventDefault();
            createUser({
              variables: {
                input: {
                  userId: new Date().valueOf().toString(),
                  name: userName,
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

export default GetAllUser;
