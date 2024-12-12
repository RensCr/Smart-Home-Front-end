import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useWebSocket } from "../Websocket/websocketcontext.jsx";
import "../Css/helpdesk.css";

const Helpdesk = () => {
  const {
    messages,
    sendMessage,
    users,
    connectUser,
    currentUser,
    TriggerGroupChat,
  } = useWebSocket();
  const [newMessage, setNewMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (selectedUser && selectedUserId) {
      console.log("Connecting user:", selectedUserId);
      connectUser({ username: selectedUser, userId: selectedUserId });
    }
  }, [selectedUser, selectedUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUserId) {
      console.log("Sending message:", newMessage);
      console.log("Selected user ID:", selectedUserId);
      sendMessage(newMessage, selectedUserId);
      setNewMessage("");
    }
  };

  const handleCloseChat = () => {
    Swal.fire({
      title: "Are you sure you want to close the chat?",
      text: "The conversation will be closed for everyone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "No, keep it open",
    }).then((result) => {
      if (result.isConfirmed) {
        setChatOpen(false);
      }
    });
  };

  return (
    <div className="helpdesk-container">
      <div className="user-list">
        <h2>Users</h2>
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              onClick={() => {
                console.log("User clicked:", user);
                setSelectedUser(user.username);
                setSelectedUserId(user.userId);
                console.log("Selected user:", user);
                TriggerGroupChat(user);
              }}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {chatOpen && (
        <div className="chat-window">
          <h5>Helpdesk Chat with {selectedUser}</h5>
          <div
            className="chat-content"
            style={{
              height: "300px",
              overflowY: "scroll",
              borderBottom: "1px solid #ccc",
            }}
          >
            {messages
              // .filter(
              //   (message: {
              //     user: string;
              //     recipientId: string;
              //     text: string;
              //   }) => {
              //     const isSelectedUser =
              //       message.recipientId.toString() ===
              //         selectedUserId.toString() ||
              //       message.user.toString() === selectedUserId.toString() ||
              //       (message.user.toString() === "1" &&
              //         message.recipientId.toString() ===
              //           selectedUserId.toString());
              //     console.log(
              //       "Message:",
              //       message,
              //       "Selected user ID:",
              //       selectedUserId,
              //       "Is selected user:",
              //       isSelectedUser
              //     );
              //     return isSelectedUser;
              //   }
              // )
              .map(
                (
                  message: { user: string; recipientId: string; text: string },
                  index: number
                ) => (
                  <div key={index} className="message">
                    {message.text}
                  </div>
                )
              )}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: "100%", padding: "5px" }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "5px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Send
          </button>
          <button
            onClick={handleCloseChat}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "5px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Close Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Helpdesk;
