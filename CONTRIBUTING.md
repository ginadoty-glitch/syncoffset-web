# Contributing to SyncOffset

Thanks for showing interest in improving **SyncOffset**.  
This guide will help you set up your environment and understand how to contribute.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**.  
The goal is to keep the codebase modular, scalable, and easy to extend.

---

## Project Layout

We use a **colocation-based file system**. Each feature keeps its own pages, components, and logic.

```
src
├── app               # Next.js routes (App Router)
│   ├── (auth)        # Auth layouts & screens
│   ├── (main)        # Main dashboard routes
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Shared UI components
├── hooks             # Reusable hooks
├── lib               # Config & utilities
├── styles            # Tailwind / theme setup
└── types             # TypeScript definitions
```

Each feature route folder colocates its own `page.tsx`, `_components/`, and supporting logic, while shared UI, hooks, and config live at the top level.

---

## Getting Started

### Fork and Clone the Repository

1. Fork the Repository

   Fork the SyncOffset repository to your own account.

2. Clone the Repository  
   ```bash
   git clone https://github.com/YOUR_USERNAME/syncoffset-web.git
   ```
   
3. Navigate into the Project  
   ```bash
   cd syncoffset-web
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear commit messages:
  ```bash
  git commit -m "feat: add finance dashboard screen"
  ```

- Open a Pull Request once ready.
- If your change adds a new UI screen or component, include a screenshot in your PR description.

---

## Where to Contribute

- **External Pages**: Landing pages or other non-dashboard routes → `src/app/(external)/`  
- **Auth Screens**: Login, register, and authentication layouts → `src/app/(main)/auth/`  
- **Dashboard Screens**: Feature dashboards like CRM, Finance, Analytics → `src/app/(main)/dashboard/`
- **Components**: Reusable UI goes in `src/components/`  
- **Hooks**: Custom logic goes in `src/hooks/`  
- **Themes**: New presets under `src/styles/presets/`  

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks are enabled - linting and formatting run automatically when you commit, and if there are errors the commit will be blocked until they are fixed. 
- Follow **Shadcn UI** style & Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard nav)
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.)
- Avoid unnecessary dependencies — prefer existing utilities where possible

---

## Submitting PRs

- Open a Pull Request once your changes are ready.  
- Ensure your branch is up to date with `main` before submitting.  
- Reference any related issue in your PR for context.

---

## Questions & Support

- Report bugs, suggestions, or issues via the SyncOffset GitHub Issues tracker.

---

Your contributions keep this project growing. 🚀

**Happy Vibe Coding!**
