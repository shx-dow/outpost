import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:3000");

let sessionId: string | null = null;
let hasSentFollowUp = false;

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "start",
      goal: "Say hello",
    }),
  );
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg.toString());
  console.log(data);

  if (data.type === "session_created") {
    sessionId = data.sessionId;
  }

  if (data.type === "session_end" && !hasSentFollowUp) {
    hasSentFollowUp = true;

    ws.send(
      JSON.stringify({
        type: "message",
        sessionId,
        input: "Now tell me a joke",
      }),
    );
  }
});
