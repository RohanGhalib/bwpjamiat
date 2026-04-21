# Islami Jamiat-e-Talaba Bahawalpur (bwpjamiat)

Official website for **Islami Jamiat-e-Talaba Bahawalpur**, the largest student organization in Pakistan. This platform serves as a central hub for students, featuring event updates, a Learning Management System (LMS), articles, literature, and organizational information.

## 🚀 Tech Stack

This project is built with modern web technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend/Database:** [Firebase](https://firebase.google.com/)
- **Language:** TypeScript
- **Fonts:** Geist, Geist Mono, Noto Nastaliq Urdu, Amiri (via `next/font`)

## ✨ Key Features

- **Events:** Stay updated on the latest conferences, workshops, and gatherings.
- **LMS (Learning Management System):** Educational resources and courses.
- **Articles & Literature:** Access to thought-provoking articles, publications, and organizational literature.
- **Taranas:** A dedicated section for Islamic anthems and taranas.
- **Ahbab Link:** Portal for alumni and well-wishers to stay connected.
- **Admin Panel:** A comprehensive dashboard to manage content seamlessly.
- **Multilingual Typography:** Optimized support for English, Urdu (Nastaliq), and Arabic typography.

## 📂 Project Structure

- `/app` - Next.js App Router containing pages, layouts, and API routes.
  - `/app/admin` - Admin dashboard.
  - `/app/articles` - Articles section.
  - `/app/events` - Events section.
  - `/app/lms` - Learning Management System.
  - `/app/literature` - Literature and publications.
  - `/app/taranas` - Taranas section.
  - `/app/contact` - Contact information.
- `/components` - Reusable UI components.
- `/lib` - Core logic, Firebase configuration (`firebase.ts`), and utilities.
- `/public` - Static assets, images, and fonts.

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Make sure your Firebase environment variables are correctly configured. (Usually found in a `.env.local` file).

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 License

All rights reserved to Islami Jamiat-e-Talaba Bahawalpur.
