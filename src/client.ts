import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:3000");

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "start",
      goal: "Say hello",
    }),
  );
});

ws.on("message", (msg) => {
  console.log(msg.toString());
});
