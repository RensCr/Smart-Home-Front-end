import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    const { type, username, userId, text, recipientId } = parsedMessage;

    if (type === "connect") {
      clients.set(userId, { ws, username, userId });
      console.log("User connected", { username, userId });
      broadcastUserList();
    } else if (type === "message") {
      if (recipientId) {
        // Send message to specific recipient
        const recipientWs = clients.get(recipientId)?.ws;
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(
            JSON.stringify({ username, userId, text, recipientId })
          );
        }
        // Also send the message back to the sender
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ username, userId, text, recipientId }));
        }
      }
    }
  });

  ws.on("close", () => {
    clients.forEach((client, userId) => {
      if (client.ws === ws) {
        clients.delete(userId);
        broadcastUserList();
      }
    });
  });

  const broadcastUserList = () => {
    const userList = Array.from(clients.values()).map((client) => ({
      username: client.username,
      userId: client.userId,
    }));
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "userList", users: userList }));
        console.log("User list sent to clients", userList);
      }
    });
  };
});

console.log("WebSocket server is running on ws://localhost:8080");
