import type { Metadata, Viewport } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoRounded = Nunito({
  variable: "--font-feather",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-duolingo-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#58CC02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://catatkata.app"),
  title: {
    default: "CatatKata — Aplikasi Catatan Kosakata Bahasa Inggris & Indonesia",
    template: "%s | CatatKata",
  },
  description:
    "CatatKata adalah aplikasi buku catatan kosakata dwibahasa (Indonesia - Inggris) gratis, cepat, dan interaktif. Bantu Anda menghafal kosakata baru, melatih vocabulary harian, serta memantau progres belajar bahasa dengan mudah.",
  keywords: [
    "catat kata",
    "catatkata",
    "aplikasi kosakata",
    "kamus bahasa inggris indonesia",
    "belajar bahasa inggris",
    "buku catatan vocabulary",
    "menghafal kosakata inggris",
    "vocabulary notebook",
    "kamus indonesia inggris",
    "tata bahasa inggris",
    "aplikasi belajar bahasa gratis",
    "kosakata harian inggris",
    "vocabulary builder indonesia",
  ],
  authors: [{ name: "CatatKata Team" }],
  creator: "CatatKata",
  publisher: "CatatKata",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/catatkataIcon.svg", type: "image/svg+xml" }],
    shortcut: "/catatkataIcon.svg",
    apple: "/catatkataIcon.svg",
  },
  openGraph: {
    title: "CatatKata — Aplikasi Catatan Kosakata Bahasa Inggris & Indonesia",
    description:
      "Buku catatan kosakata pribadi yang cepat & interaktif. Kelola vocabulary harian, tandai kata favorit, dan pantau status belajar bahasa Inggris Anda.",
    url: "https://catatkata.app",
    siteName: "CatatKata",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/catatkataIcon.svg",
        width: 124,
        height: 126,
        alt: "Logo CatatKata",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "CatatKata — Aplikasi Catatan Kosakata Bahasa Inggris",
    description:
      "Aplikasi catatan kosakata dwibahasa Indonesia - Inggris interaktif untuk tingkatkan pemahaman vocabulary Anda.",
    images: ["/catatkataIcon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${nunitoRounded.variable} ${nunitoSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#ffffff] text-[#4b4b4b] font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
