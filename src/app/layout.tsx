import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnWall — Daily Learning Wallpaper Generator",
  description: "Transform your study schedule into stunning motivational wallpapers. Upload your Excel/CSV plan, pick a theme, and download a personalized 1080×1920 wallpaper every day.",
  keywords: "learning, wallpaper, study plan, motivation, excel, schedule, daily habit",
  openGraph: {
    title: "LearnWall — Daily Learning Wallpaper Generator",
    description: "Turn your study plan into stunning wallpapers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Exo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
