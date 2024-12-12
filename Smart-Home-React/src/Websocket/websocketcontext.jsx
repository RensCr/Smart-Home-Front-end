import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const token = Cookies.get("jwtToken"); // Read the JWT token from the cookie
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7032/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR");

          connection.on(
            "ReceiveMessage",
            (userId, chatMessage, targetIdString) => {
              console.log("ReceiveMessage", userId, chatMessage);
              setMessages((prevMessages) => {
                console.log("1", prevMessages);
                return [
                  ...prevMessages,
                  {
                    user: userId,
                    text: chatMessage,
                    recipientId: targetIdString,
                  },
                ];
              });
            }
          );

          connection.on("SendToGroup", (user) => {
            setUsers((prevUsers) => {
              const exists = prevUsers.some((u) => u.userId === user.userId);
              if (!exists) {
                return [...prevUsers, user];
              }
              return prevUsers;
            });
          });
          connection.on("UserConnected", (user) => {
            setUsers((prevUsers) => {
              const exists = prevUsers.some((u) => u.userId === user.userId);
              if (!exists) {
                return [...prevUsers, user];
              }
              return prevUsers;
            });
          });
          connection.on("UserDisconnected", (user) => {
            setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== user));
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }
  }, [connection]);

  const sendMessage = (message, recipientId) => {
    console.log("sendMessage", message, recipientId);
    if (connection && connection.state === "Connected") {
      connection
        .invoke(
          "SendToGroup",
          // currentUser.userId.toString(),
          token.toString(),
          recipientId,
          message.toString()
        )
        .catch((err) => console.error(err));
    }
  };

  const connectUser = (user) => {
    setCurrentUser(user);
    if (connection && connection.state === "Connected") {
      connection
        .invoke("AddToGroup", token, "manager")
        .catch((err) => console.error(err));
      connection
        .invoke("ConnectUser", user.username, user.userId.toString())
        .catch((err) => console.error(err));
    }
  };
  const TriggerGroupChat = (user) => {
    console.log("TriggerGroupChat", user);
    if (connection && connection.state === "Connected") {
      connection
        .invoke("AddToGroup", token, user.userId.toString())
        .catch((err) => console.error(err));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        sendMessage,
        users,
        connectUser,
        currentUser,
        TriggerGroupChat,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
