// Shared logic for the vote page and the results page.
// Uses the Firebase Realtime Database when firebase-config.js is filled in;
// otherwise falls back to a same-browser demo mode for rehearsal.

import { firebaseConfig, DEFAULT_POLL } from "./firebase-config.js";

export const QUESTION = "How do you use AI in your work now?";

export const CHOICES = [
  { id: "none",   label: "Not at all",  desc: "I have not used these tools for research." },
  { id: "chat",   label: "Chat",        desc: "I ask ChatGPT, Claude, or Gemini questions and copy the answers." },
  { id: "coding", label: "Coding help", desc: "An assistant suggests or writes code that I run myself." },
  { id: "agents", label: "Agents",      desc: "An agent reads my files, runs code, and edits my project." },
];

export function pollName() {
  const p = new URLSearchParams(location.search).get("poll");
  const name = (p || DEFAULT_POLL).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  return name || "ai-talk";
}

export const isDemo = !firebaseConfig.apiKey || !firebaseConfig.databaseURL;

function emptyCounts() {
  const c = {};
  for (const ch of CHOICES) c[ch.id] = 0;
  return c;
}

// ---------- local storage helpers (per-viewer only) ----------
function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, val); } catch { /* private mode */ } }

export function myVote() { return lsGet("vote:" + pollName()); }
function rememberVote(choice) { lsSet("vote:" + pollName(), choice); }

// ---------- backend ----------
let dbPromise = null;
async function db() {
  if (!dbPromise) {
    dbPromise = (async () => {
      // firebase-lite.js is the Firebase SDK (v10.12.2, app + realtime database)
      // bundled into one file so the site has no outside script dependencies.
      const dbMod = await import("./firebase-lite.js");
      const app = dbMod.initializeApp(firebaseConfig);
      return { database: dbMod.getDatabase(app), dbMod };
    })();
  }
  return dbPromise;
}

const demoKey = () => "demo-votes:" + pollName();
const channel = ("BroadcastChannel" in window) ? new BroadcastChannel("ai-poll-demo") : null;

export async function castVote(choice) {
  if (!CHOICES.some(c => c.id === choice)) throw new Error("Unknown choice");
  if (myVote()) throw new Error("already-voted");

  if (isDemo) {
    const list = JSON.parse(lsGet(demoKey()) || "[]");
    list.push(choice);
    lsSet(demoKey(), JSON.stringify(list));
    channel && channel.postMessage("update");
    rememberVote(choice);
    return;
  }

  const { database, dbMod } = await db();
  const { ref, push, set, serverTimestamp } = dbMod;
  const node = push(ref(database, `polls/${pollName()}/votes`));
  await set(node, { choice, t: serverTimestamp() });
  rememberVote(choice);
}

// Calls onChange(counts, total) now and on every change. Returns a stop function.
export async function watchResults(onChange, onStatus = () => {}) {
  if (isDemo) {
    const read = () => {
      const counts = emptyCounts();
      for (const v of JSON.parse(lsGet(demoKey()) || "[]")) if (Object.hasOwn(counts, v)) counts[v]++;
      onChange(counts, Object.values(counts).reduce((a, b) => a + b, 0));
    };
    read();
    onStatus("demo");
    const onMsg = () => read();
    channel && channel.addEventListener("message", onMsg);
    window.addEventListener("storage", onMsg);
    return () => { channel && channel.removeEventListener("message", onMsg); window.removeEventListener("storage", onMsg); };
  }

  const { database, dbMod } = await db();
  const { ref, onValue } = dbMod;
  const stop = onValue(
    ref(database, `polls/${pollName()}/votes`),
    snap => {
      const counts = emptyCounts();
      snap.forEach(child => {
        const v = child.val();
        if (v && Object.hasOwn(counts, v.choice)) counts[v.choice]++;
      });
      onChange(counts, Object.values(counts).reduce((a, b) => a + b, 0));
      onStatus("live");
    },
    () => onStatus("error")
  );
  const connRef = ref(database, ".info/connected");
  onValue(connRef, s => onStatus(s.val() ? "live" : "offline"));
  return stop;
}
