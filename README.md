<div align="center">
  <img src="public/favicon.ico" alt="LearnWall Logo" width="80" height="80">
  
  # LearnWall
  
  **Turn Your Lock Screen into Your Ultimate Accountability Partner**
  
  [**Live Demo**](https://learnwall.vercel.app) · [**Report Bug**](https://github.com/azmatsiddique/learnwall/issues) · [**Request Feature**](https://github.com/azmatsiddique/learnwall/issues)

  ![LearnWall Preview](https://img.shields.io/badge/Status-Live-2ea44f?style=for-the-badge)
  ![Author](https://img.shields.io/badge/Author-Azmat%20Siddique-blueviolet?style=for-the-badge)
  ![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![Database](https://img.shields.io/badge/Supabase-DB-green?style=for-the-badge&logo=supabase)

</div>

---

## 🚀 What is LearnWall?

**LearnWall** is a productivity and habit-tracking web application designed to eliminate distractions by **taking over your phone's lock screen**. 

Instead of generic wallpapers, LearnWall dynamically generates a beautiful custom wallpaper every single day featuring your most important task, study goal, or to-do item. By making your goals the very first thing you see when you check your phone, LearnWall guarantees you stay accountable.

### ✨ Key Features

- 📅 **Smart CSV Uploads**: Instantly generate weeks of wallpapers by simply dropping your study schedule (Excel or CSV) into the dashboard.
- 🎨 **Beautiful Customization**: Choose between `Dark`, `Neon`, `Hacker`, `Anime`, and `Minimal` themes. 
- 🧑‍🎨 **Personal Avatars**: Pick your own avatar to represent you on your wallpaper.
- ⚡ **Gamified Streaks**: Earn XP, level up, and maintain your "Learning Streak" by checking off completed days.
- 📱 **Perfect Native Fit**: Automatically sizes the wallpaper for 21+ Android and iPhone models (Samsung S24 Ultra, iPhone 16 Pro, Google Pixel 8, OnePlus Nord, etc.)
- 🤖 **Zero-Touch Automation**: Integrates with iOS Shortcuts and Android automation tools to update your lock screen in the background while you sleep.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (React), Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (Edge Runtime)
- **Database / Auth**: Supabase (Postgres with Row-Level Security)
- **Image Generation**: `@vercel/og` (Satori / HTML-to-Image rendering)
- **State Management**: Zustand (Persisted client state)
- **Deployment**: Vercel

---

## ⚙️ How It Works (For Users)

1. **Sign Up**: Create an account on the [LearnWall Dashboard](https://learnwall.vercel.app).
2. **Upload Schedule**: Drag and drop your `.csv` study schedule.
3. **Customize**: Pick your theme, avatar, and phone model.
4. **Automate**: Copy your secure personalized API URL and paste it into Apple Shortcuts or Tasker.
5. **Wake Up**: Your phone wallpaper will instantly refresh every day at midnight with your new task!

---

## 💻 Local Development Setup

To run LearnWall locally on your machine, follow these steps:

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) Project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/azmatsiddique/learnwall.git
   cd learnwall
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Initialize the Database:
   Run the SQL code found in `supabase-setup.sql` in your Supabase SQL Editor to instantiate the required tables and security policies.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Author

Created with ❤️ by **Azmat Siddique**
- **GitHub**: [@azmatsiddique](https://github.com/azmatsiddique)
- **Live Project**: [https://learnwall.vercel.app](https://learnwall.vercel.app)

---

## 📄 License
This project is open-source and free to use.
