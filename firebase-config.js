// Paste your Firebase web app settings here (see README.md, step 3).
// Until apiKey is filled in, the site runs in demo mode: votes are stored
// only in this browser, which is enough to rehearse but not to run the poll.

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Votes are grouped under a poll name. Change it (or add ?poll=name to both
// page addresses) to start a fresh count for a new audience.
export const DEFAULT_POLL = "ai-talk";
