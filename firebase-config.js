// Firebase web app settings for project ai-poll-6aa7d (README.md, step 3).
// These values are meant to be public; the database rules protect the data.

export const firebaseConfig = {
  apiKey: "AIzaSyDG4HUxrR1LLB-6059hT4mtAse9d4nQkkI",
  authDomain: "ai-poll-6aa7d.firebaseapp.com",
  databaseURL: "https://ai-poll-6aa7d-default-rtdb.firebaseio.com",
  projectId: "ai-poll-6aa7d",
  storageBucket: "ai-poll-6aa7d.firebasestorage.app",
  messagingSenderId: "454373791969",
  appId: "1:454373791969:web:db6e8ee022cbd9cec3ffa0"
};

// Votes are grouped under a poll name. Change it (or add ?poll=name to both
// page addresses) to start a fresh count for a new audience.
export const DEFAULT_POLL = "ai-talk";
