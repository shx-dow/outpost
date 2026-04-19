import { OutpostEvent } from "../types/events.js"

export function mapPIEvent(event: any): OutpostEvent | null {
  switch (event.type) {
    case "agent_start":
      return { type: "session_start" };
    
    case "message_update":
      if (
        event.assistantMessageEvent?.type === "text_delta"
      ) {
        return {
          type: "assistant_stream",
          text: event.assistantMessageEvent.delta,
        };
      }
      return null;
    
    case "message_end":
      if (event.message?.role === "assistant") {
        const text = event.message.content
          ?.map((c: any) => c.text || "")
          .join("");
        return {
          type: "assistant_message",
          text,
        };
      }
      return null;
    
    case "agent_end":
      return { type: "session_end" };
    
    default:
      return null;
  }
}