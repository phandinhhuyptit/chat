import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import { split, from } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import * as serviceWorker from "./serviceWorker";

const httpLink = new HttpLink({
  uri: `http://localhost:9005/kompaql`,
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:9005/kompaql`,
  options: {
    reconnect: true,
  },
});

const cache = new InMemoryCache();

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
    // return kind === "OperationDefinition";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: from([link]),
  cache,
  connectToDevTools: true,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
