import Fastify from "fastify";
import { WebSocketServer } from "ws";
import { SessionManager } from "./core/session-manager.js";
import { ClientMessage } from "./types/ws.js";

const app = Fastify();
const sessionManager = new SessionManager();

const wss = new WebSocketServer({ noServer: true });

app.server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString()) as ClientMessage;

      if (data.type === "start") {
        const sessionId = await sessionManager.createSession(data.goal);

        ws.send(JSON.stringify({ type: "session_created", sessionId }));

        sessionManager.subscribe(sessionId, (event) => {
          ws.send(JSON.stringify(event));
        });
      }

      if (data.type === "message") {
        sessionManager.sendMessage(data.sessionId, data.input);
      }

      if (data.type === "stop") {
        sessionManager.stopSession(data.sessionId);
      }
    });
  });
});

app.listen({ port: 3000 }, () => {
  console.log("Server running on port 3000");
});
