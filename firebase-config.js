// Paste your Firebase web app settings here (see README.md, step 3).
// Until apiKey is filled in, the site runs in demo mode: votes are stored
// only in this browser, which is enough to rehearse but not to run the poll.

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG4HUxrR1LLB-6059hT4mtAse9d4nQkkI",
  authDomain: "ai-poll-6aa7d.firebaseapp.com",
  databaseURL: "https://ai-poll-6aa7d-default-rtdb.firebaseio.com",
  projectId: "ai-poll-6aa7d",
  storageBucket: "ai-poll-6aa7d.firebasestorage.app",
  messagingSenderId: "454373791969",
  appId: "1:454373791969:web:db6e8ee022cbd9cec3ffa0",
  measurementId: "G-68PLNCTY39"
};

// Votes are grouped under a poll name. Change it (or add ?poll=name to both
// page addresses) to start a fresh count for a new audience.
export const DEFAULT_POLL = "ai-talk";
