import { Geist, Geist_Mono } from "next/font/google";
import { Poppins, Mukta } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/lib/socket";  // ✅ added provider

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const mukta = Mukta({
  weight: ["400", "500", "700"],
  subsets: ["latin", "devanagari"], // ✅ supports Indian languages
  variable: "--font-mukta",
});

export const metadata = {
  title: "MediConnect",
  description: "Bridging the Healthcare Gap with CSR, NGOs & Doctors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${mukta.variable} antialiased dark`}
      >
        {/* ✅ Wrap all pages with SocketProvider so socket works globally */}
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}