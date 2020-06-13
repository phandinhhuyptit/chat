import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
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

const SUB_USER = gql`
  subscription createUserRealtime {
    createUserRealtime {
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
      // updateUsers([...users, createUser]);
    },
  });

  useEffect(() => {
    if (data && data.Users) {
      updateUsers(data.Users);
    }
  }, [data]);

  useSubscription(SUB_USER, {
    onSubscriptionData({ subscriptionData }) {
      updateUsers([...users, subscriptionData.data.createUserRealtime]);
    },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <div>
      <h5>All Users</h5>
      <ListGroup>
        {users.map((item) => {
          return <ListGroup.Item key={item.userId}>{item.name}</ListGroup.Item>;
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
          variant="primary"
          type="button"
        >
          Create
        </Button>
      </Form>
    </div>
  );
}

export default GetAllUser;
