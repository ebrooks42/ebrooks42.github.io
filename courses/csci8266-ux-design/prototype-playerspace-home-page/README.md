# Youth Sports Team Home Page Prototype

A static site prototype for a youth sports team home page built with Svelte and Tailwind CSS.

## Features

- **Header Section**: YMCA logo placeholder, team details (name, location, coach, division), and player picture placeholder
- **Navigation Menu**: Four main sections - Home, Roster, Activity, and Coach's Corner
- **Home Page**: Displays upcoming events with jersey color information
- **Responsive Design**: Built with Tailwind CSS for a mobile-friendly interface

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte     # Main layout with header and navigation
│   ├── +page.svelte       # Home page with upcoming events
│   └── layout.css         # Tailwind CSS imports
├── lib/
│   └── assets/            # Asset placeholders
└── app.html               # HTML template
```

## Setup and Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## Building

Build the static site for production:

```sh
npm run build
```

The static site will be generated in the `build/` directory, ready for deployment to any static hosting platform.

## Configuration

This project is configured to generate a static site using `@sveltejs/adapter-static`. The `svelte.config.js` file includes:

- Static adapter with `index.html` fallback
- Prerendering enabled for all routes
- Crawl-based route discovery

## Technologies

- **Svelte 5**: A responsive framework for building user interfaces
- **Tailwind CSS 4**: A utility-first CSS framework
- **TypeScript**: For type-safe development
- **Vite**: Fast build tool and development server
