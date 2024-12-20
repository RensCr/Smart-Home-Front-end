import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../Websocket/websocketcontext.jsx";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Index() {
  const navigate = useNavigate();
  const { messages, sendMessage, connectUser, currentUser } = useWebSocket();
  interface ApparatenType {
    id: number;
    naam: string;
    apparaatType: string;
    slim: boolean;
    status: boolean;
  }

  const [Apparaten, setApparaattypes] = useState<ApparatenType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("User");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const checkJwtToken = () => {
      const cookies = document.cookie.split("; ");
      const jwtTokenCookie = cookies.find((cookie) =>
        cookie.startsWith("jwtToken=")
      );
      if (jwtTokenCookie) {
        console.log("jwtToken cookie found");
      } else {
        console.log("jwtToken cookie not found, redirecting to login");
        navigate("/inloggen");
      }
    };

    checkJwtToken();
    fetchApparaten();
  }, [navigate]);

  const fetchApparaten = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        console.error("JWT token not found in cookies");
        return;
      }
      const huisId = localStorage.getItem("GeselecteerdeWoningsID");
      const response = await fetch(
        `https://localhost:7032/Apparaten?HuisId=${huisId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch apparaten");
        return;
      }

      const data = await response.json();
      setApparaattypes(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredApparaten = Apparaten.filter((apparaat) => {
    const query = searchQuery.toLowerCase();
    return (
      apparaat.naam.toLowerCase().includes(query) ||
      apparaat.apparaatType.toLowerCase().includes(query) ||
      (query === "slim" && apparaat.slim) ||
      (query === "niet slim" && !apparaat.slim)
    );
  });
  const VerranderStatus = async (apparaatId: number, status: boolean) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        console.error("JWT token not found in cookies");
        return;
      }

      const response = await fetch(
        `https://localhost:7032/Apparaat/verranderStatus`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apparaatId, status }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update apparaat status");
        return;
      }

      fetchApparaten(); // Refresh apparaten list after updating the status
    } catch (error) {
      console.error("Error updating apparaat status:", error);
    }
  };
  const VerranderSlim = async (apparaatId: number, status: boolean) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        console.error("JWT token not found in cookies");
        return;
      }

      const response = await fetch(
        `https://localhost:7032/Apparaat/verranderSlim`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apparaatId, status }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update apparaat status");
        return;
      }

      fetchApparaten(); // Refresh apparaten list after updating the status
    } catch (error) {
      console.error("Error updating apparaat status:", error);
    }
  };

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      connectUser({ username, userId });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, "manager");
      setNewMessage("");
    }
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setUsername={setUsername}
        setUserId={setUserId}
      />
      <div className="container-fluid">
        <div className="row">
          {filteredApparaten.map((apparaat) => (
            <div key={apparaat.id} className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {apparaat.apparaatType} - {apparaat.naam}
                  </h5>
                  <p className="card-text">
                    {apparaat.slim ? "Slim" : "Niet slim"}
                    <br />
                    {apparaat.status ? "status - Aan" : "status - Uit"}
                  </p>
                  <br />
                  <a
                    href="#"
                    className="btn btn-aan"
                    onClick={() => VerranderStatus(apparaat.id, true)}
                  >
                    Aan
                  </a>
                  <a
                    href="#"
                    className="btn btn-uit"
                    onClick={() => VerranderStatus(apparaat.id, false)}
                  >
                    Uit
                  </a>
                  <a
                    href="#"
                    className="btn btn-slim"
                    onClick={() => VerranderSlim(apparaat.id, !apparaat.slim)}
                  >
                    Slim
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="chat-bubble"
        onClick={toggleChatWindow}
        style={{
          position: "fixed",
          bottom: "70px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          padding: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          fontSize: "20px",
        }}
      >
        💬
      </div>

      {isChatOpen && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <h5>Chat</h5>
          <div
            className="chat-content"
            style={{
              height: "300px",
              overflowY: "scroll",
              borderBottom: "1px solid #ccc",
            }}
          >
            {messages.map(
              (
                message: { text: string; recipientId: string },
                index: number
              ) => {
                const isManager = message.recipientId === "manager";
                return (
                  <div
                    key={index}
                    style={{
                      textAlign: isManager ? "left" : "right",
                      color: isManager ? "green" : "blue",
                      margin: "5px 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: isManager ? "#d4edda" : "#cce5ff",
                        color: isManager ? "#155724" : "#004085",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        maxWidth: "80%",
                        wordWrap: "break-word",
                      }}
                    >
                      {message.text}
                    </span>
                  </div>
                );
              }
            )}
          </div>
          <div>
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
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Index;
