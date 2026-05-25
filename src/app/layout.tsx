import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./(default)/globals.css";
import { LanguageProvider } from "@/src/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flipcon",
  description: "Flipcon",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const colorId = localStorage.getItem('flipcon-theme-color');
                if (colorId) {
                  const themeColors = {
                    'blue': { hex: '#040035', grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, #040035 0%, #000000 75%)' },
                    'purple': { hex: '#1e0035', grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, #1e0035 0%, #000000 75%)' },
                    'green': { hex: '#00251a', grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, #00251a 0%, #000000 75%)' },
                    'red': { hex: '#250000', grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, #250000 0%, #000000 75%)' },
                    'gray': { hex: '#111111', grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, #111111 0%, #000000 75%)' }
                  };
                  const color = themeColors[colorId] || { hex: colorId, grad: 'radial-gradient(ellipse 120% 80% at 50% 20%, ' + colorId + ' 0%, #000000 75%)' };
                  if (color) {
                    document.documentElement.style.setProperty('--background', color.hex);
                    document.documentElement.style.setProperty('--sidebar-background', color.hex);
                    document.documentElement.style.setProperty('--background-gradient', color.grad);
                  }
                }
              } catch (e) {}
            })();
          `
        }} />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
