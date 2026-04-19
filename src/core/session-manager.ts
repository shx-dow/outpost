import { createAgentSession } from "@mariozechner/pi-coding-agent";
import { mapPIEvent } from "./event-mapper.js";

type Listener = (event: any) => void;

export class SessionManager {
  private sessions = new Map<string, any>();
  private listeners = new Map<string, Listener[]>();
  
  async createSession(goal: string) {
    const id = crypto.randomUUID();
    
    const { session } = await createAgentSession();
    
    this.sessions.set(id, session);
    this.listeners.set(id, []);
    
    session.subscribe((event: any) => {
      const mapped = mapPIEvent(event);
      if (!mapped) return;
      
      const subs = this.listeners.get(id) || [];
      subs.forEach((fn) => fn(mapped));
    });
    
    session.prompt(goal);
    
    return id;
  }
  
  subscribe(sessionId: string, listener: Listener) {
    const subs = this.listeners.get(sessionId);
    if (!subs) return;
    
    subs.push(listener);
  }
}