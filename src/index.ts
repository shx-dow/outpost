import Fastify from "fastify";
import { WebSocketServer } from "ws";
import { SessionManager } from "./core/session-manager.js";

const app = Fastify();
const sessionManager = new SessionManager();

const wss = new WebSocketServer({ noServer: true });

app.server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString());
      
      if (data.type === "start") {
        const sessionID = await sessionManager.createSession(
          data.goal
        );
        
        ws.send(JSON.stringify({ type: "session_created", sessionID }));
        
        sessionManager.subscribe(sessionID, (event) => {
          ws.send(JSON.stringify(event));
        });
      }
    });
  });
});

app.listen({ port: 3000 }, () => {
  console.log("Server running on port 3000")
})