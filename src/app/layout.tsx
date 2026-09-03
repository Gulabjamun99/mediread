import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediRead - Asaan Bhasha Me Apni Report Samjhein",
  description:
    "Medical test report, doctor ki slip, ya X-ray upload karo. AI aasan Hinglish me samjha dega - kya normal, kya bimari suspect, dawa kaise leni hai.",
  keywords: [
    "medical report",
    "report reader",
    "prescription reader",
    "xray analysis",
    "AI health",
    "Hinglish medical",
    "lab report",
  ],
  authors: [{ name: "MediRead" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MediRead - Apni Report Asaan Bhasha Me Samjhein",
    description:
      "AI se medical report, doctor slip, aur X-ray ko aasan Hinglish me samjho.",
    siteName: "MediRead",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediRead",
    description: "Medical report ko asaan bhasha me samjho - AI powered.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
