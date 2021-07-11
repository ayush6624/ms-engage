## Microsoft Engage Teams Clone

Mentee: [Ayush Goyal](https://www.github.com/ayush6624) `<ayushg1214@gmail.com>`  
Mentor #1: Akash Gupta `<akasgup@microsoft.com>`  
Mentor #2: Lakesh Kumar `<lakesh.kumar@microsoft.com>`

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

---

## 💡 Features

-   **Start** a new Meeting or **Join** an exiting one using it's roomname
-   Supports **Multiple Number** of Participants
-   **User Authentication** - Use your Google Account to sign in
-   **Toggle** your camera / mic
-   Shows every participant's mic/camera's state **indicators**
-   **Themes** - Switch between Light or Dark Mode
-   **Virtual Background** - Uses a TensorFlowJS PoseNet 1.0 model under the hood to switch backgrounds of the participant
-   **Blur Background** - Use Gaussian Blur Algorithm to blur out the background
-   **Chat** - with others after joining a room, during a meeting, or after exiting and returning back to the room.
-   **Celebrate** - Click on the Confetti icon in the control bar and share the joy with your team!
-   Screen Share
-   **Toast Notifications** - See rich color coded notifications for events
-   **Network Health** - Indicates the participant's Network Quality on a scale of 0 - 5, also logs the data for monitoring
-   **Invitation** - Invite your friends over sending them an invite over an email (Mailgun)
-   **Rejoin meetings** from the homescreen
-   **Progressive Web Application** (PWA) - Installable Cross-Platform native app experience
-   **Analytics** - Store request logs with detailed Network and device information 

---

## 🛠 Tech Stack

-   React
-   NextJS
-   Express
-   PostgreSQL
-   Tailwind CSS
-   TypeScript
-   JavaScript

---

## 💻 CI / CD

-   Used [Vercel]("https://vercel.com") for deploying the NextJS app and was the CD provider
-   Vercel took care of building the app, and also act as a CI with complete build logs.
-   Used [Google Cloud Build]("https://cloud.google.com/build") to build the API and push the `Docker Image` to the [Google Cloud Container Registry]("https://cloud.google.com/container-registry")
-   The Docker image is then deployed on a GCP Cloud Instance and requests handled on `api-teams.ayushgoyal.dev`
-   These workflows gave me high confidence in building the application and spot and fix any issues quickly

---

## 💼 Agile Methdology

[Agile Board](https://github.com/ayush6624/ms-engage/projects/1)

- Project was broken into multiple small tasks.
- Tracked on the Github Project manager board.
- Tasks were divider into 3 categories - `Todo`, `In Progress`, `Done`.
- Any commit which completed a feature had a `closed #` tag associated with it, referencing the particular task, which was subsequently moved to the `Done` pile.

---

Also checkout the [API Docs](./server/README.md)

---

## 📍 Run the client app locally

Clone the project

```bash
  git clone https://github.com/ayush6624/ms-engage
  cd my-engage
```

Install dependencies

```bash
  yarn
```

Run the dev server

```bash
  yarn dev
```

Open [http://localhost:3000](http://localhost:3000)   

---

## 🌎 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GOOGLE_OAUTH_KEY` - OAuth Key [Link]('https://developers.google.com/identity/protocols/oauth2')  
`GOOGLE_OAUTH_SECRET` - OAuth Secret  
`NEXTAUTH_URL` - Callback URL  
`TWILIO_AC_SID` - Twilio Account SID  
`TWILIO_SID` - Twilio SID  
`TWILIO_SECRET` - Twilio Token signing secret

---

## 🗺 API Reference

#### Authentication (Managed by next-auth)

```http
GET /api/auth/signin
```

#### Get the current session

```http
GET /api/auth/session
```

#### Generate a new meeting

```http
GET /api/room
```

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `identity` | `string` | **Required**. Unique Identity |
| `room`     | `string` | **Optional**. Room Name       |

**Checkout** the [API Docs](./server/README.md) for more

## 👀 Improvements
- Allow people with the same email id to join themselves multiple times
- Add Whiteboard Collaboration