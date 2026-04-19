import { createAgentSession } from "@mariozechner/pi-coding-agent";
import { mapPIEvent } from "../core/event-mapper.js";

export async function runPI(goal: string) {
  const { session } = await createAgentSession();

  session.subscribe((event) => {
    const mapped = mapPIEvent(event);
    
    if (mapped) {
      console.log("EVENT:", mapped);
    }
  });

  await session.prompt(goal);
}