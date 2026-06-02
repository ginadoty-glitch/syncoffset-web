# SyncOffset — Web

**Production office + dispatch infrastructure for film and television.** Transport coordination, document custody, crew logistics, and departmental accountability.

<img src="./media/dashboard.png" alt="SyncOffset Dashboard Screenshot">

SyncOffset is the operational command center for film production transportation and logistics — built for transport orders, shipments, brokerage documents, rush orders, and holdbacks, with a dark operational theme and a live transport intelligence rail.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI
- Responsive and mobile-friendly
- Customizable theme presets (light/dark modes with multiple color schemes)
- Flexible layouts (collapsible sidebar, variable content widths)
- Logistics command center (live transport map, active movements, dispatch intelligence)
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support *(planned)*

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod
- **Forms & State Management**: React Hook Form, Zustand
- **Tables & Data Handling**: TanStack Table
- **Tooling & DX**: Biome, Husky

## Colocation File System Architecture

This project follows a **colocation-based architecture** — each feature keeps its own pages, components, and logic inside its route folder. Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

## Getting Started

### Run locally

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   ```

2. **Navigate into the project**
   ```bash
   cd syncoffset-web
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Formatting and Linting

Format, lint, and organize imports:

```bash
npx @biomejs/biome check --write
```

> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

---

> [!IMPORTANT]
> This project is updated frequently. If you're working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.
