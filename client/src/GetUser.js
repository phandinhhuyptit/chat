import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { ListGroup, Button, Form } from "react-bootstrap";

const QUERY_USE = gql`
  query Users {
    Users {
      userId
      name
    }
  }
`;

const MUTATION_USE = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      userId
      name
    }
  }
`;

const SUB_USE = gql`
  subscription createUserRealtime {
    createUserRealtime {
      userId
      name
    }
  }
`;

export default function GetUser() {
  const { loading, error, data } = useQuery(QUERY_USE);
  const [userName, changeUserName] = useState();
  const [users, updateUsers] = useState([]);

  const [createUser] = useMutation(MUTATION_USE, {
    update(cache, { data: { createUser } }) {
      // updateUsers([...users, createUser]);
    },
  });

  useSubscription(SUB_USE, {
    onSubscriptionData({ subscriptionData }) {
      updateUsers([...users, subscriptionData.data.createUserRealtime]);
    },
  });

  useEffect(() => {
    if (data && data.Users) {
      updateUsers(data.Users);
    }
  }, [data]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return (
    <div>
      {users.map((item) => {
        return <li key={item.userId}>{item.name}</li>;
      })}
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
