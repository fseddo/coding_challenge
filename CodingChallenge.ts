// Requirements

// Create a stable key for each event:
// key = messageId + ":" + type + ":" + recipient
// Cleaning rules
// messageId and recipient: if missing or empty/whitespace → "unknown"
// type: trim + lowercase; if missing/empty → "unknown"
// ts: if missing or not a finite number → Date.now()
// Deduping rules
// If multiple events share the same key, keep the event with the earliest ts
// Output
// Return the deduped list sorted by ts ascending
// Output should be an array of CleanEvent

type ProviderEvent = {

messageId?: string;

type?: string; // not guaranteed to be normalized

recipient?: string;

ts?: number; // epoch ms; may be missing

};

 

type CleanEvent = {

messageId: string;

type: string;

recipient: string;

ts: number;

};

 

function cleanStr(v?: string): string {

const t = (v ?? "").trim();

return t.length ? t : "unknown";

}

 

function cleanType(v?: string): string {

const t = (v ?? "").trim().toLowerCase();

return t.length ? t : "unknown";

}

 

function cleanTs(v?: number): number {

return Number.isFinite(v) ? (v as number) : Date.now();

}

 

/**

* Dedupe by messageId:type:recipient (after cleaning).

* For duplicates, keep the earliest ts.

* Return sorted by ts ascending.

*/

export function dedupeEvents(events: ProviderEvent[]): CleanEvent[] {

const DEDUPE_DICTIONARY: Record<string, CleanEvent> = {}

events.forEach(event => {
    const messageId = cleanStr(event.messageId)
    const type = cleanType(event.type)
    const recipient = cleanStr(event.recipient)
    const ts = cleanTs(event.ts)

    const cleanEvent: CleanEvent = { messageId, type, recipient, ts }


    const key = `${messageId}:${type}:${recipient}`

    if(DEDUPE_DICTIONARY[key]) {
        // if the event already exists, check if the ts is earlier than the existing one
        if(ts< DEDUPE_DICTIONARY[key].ts) {
            DEDUPE_DICTIONARY[key] = cleanEvent
        }
    } else {
        DEDUPE_DICTIONARY[key] = cleanEvent
    }

})



return Object.values(DEDUPE_DICTIONARY).sort((a, b) => a.ts - b.ts);

}

 

// Example input

const input: ProviderEvent[] = [

{ messageId: "m1", type: "DELIVERED", recipient: "a@x.com", ts: 1000 },

{ messageId: "m1", type: "delivered", recipient: "a@x.com", ts: 900 }, // duplicate, earlier

{ messageId: "m2", type: "opened", recipient: "b@x.com", ts: 1100 },

{ messageId: "m2", type: "opened", recipient: "b@x.com", ts: 1200 }, // duplicate, later

];