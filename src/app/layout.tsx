import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import ScrollDown from '@/components/ScrollDown';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wentitech - Profesjonalne instalacje wentylacyjne | Gdynia",
  description: "Wentitech to specjaliści od instalacji wentylacyjnych, systemów przeciwpożarowych i pomp ciepła w Gdyni. Konkurencyjne ceny, wysoka jakość.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Apply saved theme before hydration to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try {
                var saved = localStorage.getItem('darkMode');
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var useDark = saved === 'true' || (saved === null && prefersDark);
                var root = document.documentElement;
                var body = document.body;
                if (useDark) {
                  root.classList.add('dark');
                  body && body.classList.add('dark');
                  root.classList.remove('light');
                  body && body.classList.remove('light');
                  root.setAttribute('data-theme','dark');
                } else {
                  root.classList.remove('dark');
                  body && body.classList.remove('dark');
                  root.classList.add('light');
                  body && body.classList.add('light');
                  root.setAttribute('data-theme','light');
                }
              } catch(e){}
            })();
          `}}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
  <a className="skip-link" href="#main">Pomiń nawigację</a>
  {children}
      <ScrollDown />
      </body>
    </html>
  );
}
