# Employee Recognition API

A prototype GraphQL server for a real-time employee recognition system.  
Employees can send “kudos” to one another with messages and emojis, with public/private/anonymous visibility, plus a subscription for real-time updates.  

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)    
3. [Running the Server](#installation--running-from-source)   
4. [Testing Using Postman](#testing-using-postman)  
5. [Decisions, Assumptions & Trade-offs](#decisions-assumptions--trade-offs)  
6. [Handling Ambiguity & Conflicting Requirements](#handling-ambiguity--conflicting-requirements)  

---

## Features

- **Recognitions**  
  - `addRecognition` mutation (public / private / anonymous)  
  - `allRecognitions` & `recognitionsByTeam` queries  
- **Real-time updates** via GraphQL `subscription recognitionAdded`  
- **Role-based access control**  
  - **USER** sees public + private addressed to them  
  - **ADMIN** sees everything  
- **Extensible schema**: easy to add badges, reactions, comments, analytics  

---

## Prerequisites

- **Node.js** ≥ 14.x  
- **npm**  

---

###running-the-server
- npm install
- npm run dev

##Testing Using Postman
- Open postman
- method: POST
- url: http://localhost:4000/graphql
- Headers- Content-Type:application/json
- Body- select graphql and paste this:

mutation {
  addRecognition(
    from: "user1", 
    to: "user2",
    message: "Great work!",
    emoji: "🎉",
    visibility: PUBLIC,
    team: "Engineering",
    keywordTags: ["team","kudos"]
  ) {
    id
    message
    emoji
    visibility
    createdAt
  }
}
- send the query
- view this recognition by using this body:
query {
  allRecognitions {
    id
    from
    to
    message
    emoji
    visibility
    createdAt
  }
}


## 5. Decisions, Assumptions & Trade-offs

### In-Memory Store
- **Why:** Rapid prototype with zero DB setup.  
- **Trade-off:** Volatile data; swapping to PostgreSQL or MongoDB is straightforward later.

### Apollo Server + Subscriptions
- **Why:** Bake in GraphQL over HTTP & WebSockets with minimal config.  
- **Trade-off:** Clients must support WS or fallback to polling.

### Auth Stub (`auth.ts`)
- **Why:** Keep focus on schema & logic; real JWT integration can be layered in.  
- **Assumption:** `Authorization` header is a simple user ID or token string.

### TypeScript + CommonJS
- **Why:** Strong typing and easy startup with `ts-node`.  
- **Trade-off:** Sacrifices cleaner ESM syntax, but avoids loader complexity.

### Schema-First Design
- **Why:** Clear contract for clients; documentation via SDL.  
- **Trade-off:** Resolver typing sometimes needs `any` casts for subscriptions.

---

## 6. Handling Ambiguity & Conflicting Requirements

### “Real-time unless too hard”
- **Solution:** Implement WS subscriptions for live updates.  
- **Fallback:** Clients can poll `allRecognitions` every 10 minutes.

### Sender vs. Context
- **Conflict:** Should clients supply `from`?  
- **Resolution:** Removed `from` from mutation args; always derive from authenticated context to prevent spoofing.

### Visibility Rules
- **Ambiguity:** How to enforce public/private/anonymous?  
- **Implementation:**  
  - **PUBLIC:** everyone sees.  
  - **PRIVATE:** only recipient & ADMIN see.  
  - **ANONYMOUS:** shows `from: null` in response.
