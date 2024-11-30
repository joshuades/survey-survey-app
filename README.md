## Project Overview

This web application is a survey builder created with Next.js. It enables users to create, customize and manage surveys. It incorporates OpenAI's AI model to support you finding better survey questions. The app is designed to be more minimalistic and fun to use, rather then being very intuitive. The main purpose of this project is demonstrating a production-ready stack of modern web technologies for small and middle-sized service web applications, as well as (in the future) enhancing this service in many ways utilizing AI.

## Technical Highlights

- fully type-safe using **Typescript**
- Next.js 14 with the App Router
  - **SSR**, **Server Components** & **Dynamic Rendering** for a fast initial page load as well as a smooth user experience
  - Convenient Routing, Integrated Caching and more
- serverless SQL database with **Vercel Postgres**
- **Drizzle ORM** to simplify database management
- serverless REST API to interact with the database on client-side
- secure **OAuth authentication** with Google, using the **NextAuth** library
- **Zustand** library for convenient state management
