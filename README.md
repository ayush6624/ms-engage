## Microsoft Engage Teams Clone

Mentee: [Ayush Goyal](https://www.github.com/ayush6624) `<ayushg1214@gmail.com>`  
Mentor #1: Akash Gupta `<akasgup@microsoft.com>`  
Mentor #2: Lakesh Kumar `<lakesh.kumar@microsoft.com>`

---

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![Build CI](https://github.com/ayush6624/ms-engage/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ayush6624/ms-engage/actions/workflows/main.yml)   
[Agile Board](https://github.com/ayush6624/ms-engage/projects/1)

---

## Tech Stack

-   NextJS
-   Javascript
-   Tailwind CSS

---

## Run Locally

Clone the project

```bash
  git clone https://github.com/ayush6624/ms-engage
```

Go to the project directory

```bash
  cd my-engage
```

Install dependencies

```bash
  yarn
```

Build the website

```bash
  yarn build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

---

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GOOGLE_OAUTH_KEY`

`GOOGLE_OAUTH_SECRET`

`NEXTAUTH_URL`

`TWILIO_AC_SID`

`TWILIO_SID`

`TWILIO_SECRET`

---

## API Reference

#### Get all items

```http
  GET /api/room
```

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `identity` | `string` | **Required**. Unique Identity |
| `room`     | `string` | **Required**. Room Name       |
