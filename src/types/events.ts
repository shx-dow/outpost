export type OutpostEvent =
  | { type: "session_start" }
  | { type: "assistant_stream"; text: string }
  | { type: "assistant_message"; text: string }
  | { type: "session_end" };