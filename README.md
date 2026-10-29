# Rastro Frontend

Frontend application for Rastro, a platform for reporting lost and found animals.

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- Axios
- Vitest
- React Testing Library

## Requirements

- Node.js compatible with Vite 8
- npm

## Getting Started

Install dependencies:

    npm install

Start the development server:

    npm run dev

## Available Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the application for production.
- `npm run preview` - Preview the production build.
- `npm run lint` - Run ESLint.
- `npm run test` - Run tests in watch mode.
- `npm run test:run` - Run tests once.

## Backend Integration

The frontend communicates with the Rastro Spring Boot REST API.

During development, Vite proxies requests from `/api` to `http://localhost:8081`.

## Project Status

Initial frontend configuration completed.

Migration of the UI components generated with v0 is pending.