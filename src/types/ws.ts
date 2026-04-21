export type ClientMessage =
  | { type: "start"; goal: string }
  | { type: "message"; sessionId: string; input: string }
  | { type: "stop"; sessionId: string };
