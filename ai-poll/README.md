# AI use poll

A one-question audience poll for the talk "How I use AI in my research." People scan a QR code, answer on their phone, and the results page shows a live bar chart on the projector.

- Vote page: `https://gjunet.github.io/ai-poll/`
- Results page (put this on the screen): `https://gjunet.github.io/ai-poll/results.html`

The site was written by Claude as part of the talk's demonstration that an agent can build tools the researcher could not build alone.

## How it works

GitHub Pages hosts the two web pages for free, but GitHub Pages cannot store anything. The votes go to a Firebase Realtime Database, which is Google's free hosted database. Each vote is saved as one record with the answer and a server timestamp. The results page listens to the database and redraws the chart within about a second of each vote.

A phone can vote once per poll. The page remembers the vote in that phone's browser, so a person who clears their browser data could vote again. That is acceptable for a classroom poll and not suitable for anything that matters.

No names, emails, or other identifying information are collected.

## Files

| File | Purpose |
|---|---|
| `index.html` | The vote page people reach from the QR code |
| `results.html` | The live results page for the projector, with its own QR code |
| `poll.js` | The question, the four answers, and the code that saves and counts votes |
| `firebase-config.js` | Your Firebase settings (you fill this in, step 3) |
| `firebase-lite.js` | The Firebase library, bundled so the site loads nothing from other websites |
| `qrcode.js` | QR code library (MIT license, Kazuhiko Arase) |
| `database.rules.json` | Database security rules (you paste these in, step 4) |
| `style.css` | UMB colors and layout |
| `poll-qr.png` | QR code image for the slide |

Until `firebase-config.js` is filled in, the site runs in demo mode. Votes are then kept in the one browser that cast them, which is enough to see how the pages look but not enough to run the poll.

## Setup (about 20 minutes, once)

### 1. Put the files on GitHub

1. Sign in at github.com and click **New repository**. Name it `ai-poll`, make it **Public**, and click **Create repository**.
2. On the new repository page, click **uploading an existing file**. Drag in every file from this folder, including `.nojekyll`. On a Mac, press Cmd+Shift+period in Finder to show that hidden file. Click **Commit changes**.

### 2. Turn on GitHub Pages

1. In the repository, open **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, and click **Save**.
3. After a minute or two, the vote page is live at `https://gjunet.github.io/ai-poll/`. If your GitHub username is not `gjunet`, the address uses your username instead, and the QR code on the slide must be regenerated.

### 3. Create the Firebase database

1. Go to console.firebase.google.com and sign in with a Google account. Click **Create a project**, name it `ai-poll`, and turn off Google Analytics (not needed).
2. In the left menu, open **Build**, then **Realtime Database**, and click **Create Database**. Pick the United States location and choose **Start in locked mode**.
3. Open **Project settings** (the gear icon), scroll to **Your apps**, and click the web icon (`</>`). Name the app `ai-poll` and click **Register app**. Firebase shows a block of settings that starts with `const firebaseConfig = {`.
4. Copy the values from that block into `firebase-config.js` in your GitHub repository. On GitHub, open the file, click the pencil icon to edit, paste each value between the matching quotation marks, and click **Commit changes**. Check that `databaseURL` is filled in; if Firebase did not show it, copy the address shown at the top of the Realtime Database page (it ends in `firebasedatabase.app` or `firebaseio.com`).

The Firebase web settings are designed to be public, so it is safe for them to sit in a public repository. The security rules in step 4 are what protect the database.

### 4. Paste in the security rules

1. In Firebase, open **Realtime Database**, then the **Rules** tab.
2. Replace everything there with the contents of `database.rules.json` and click **Publish**.

The rules let anyone read the counts and add a vote. A vote must be one of the four answers and must carry the server's timestamp, and no one can change or delete a vote from the website.

### 5. Test it

Open the results page on your laptop and the vote page on your phone. Vote on the phone and watch the bar move on the laptop. The dot at the bottom of the results page turns green and reads "Live" when it is connected.

## Running a fresh poll

Votes are grouped under a poll name, `ai-talk` by default. To start from zero for a new audience, add `?poll=` and a new name to both addresses, for example:

- `https://gjunet.github.io/ai-poll/?poll=umb-oct`
- `https://gjunet.github.io/ai-poll/results.html?poll=umb-oct`

The QR code on the results page picks up the poll name automatically. The QR code on the slide points at the default poll, so either clear the old votes or regenerate the slide QR code with the new address.

To delete votes, open **Realtime Database** in the Firebase console, hover over `polls` or a poll name, and click the trash icon.

## Changing the question or answers

Edit `QUESTION` and `CHOICES` at the top of `poll.js`, and change the heading text in `index.html` and `results.html`. If you change the answer ids (`none`, `chat`, `coding`, `agents`), update the matching list in `database.rules.json` and publish the rules again.

## Cost

The Firebase free plan allows 100 simultaneous connections and 1 GB of storage, which covers a lecture hall. GitHub Pages is free for public repositories.
