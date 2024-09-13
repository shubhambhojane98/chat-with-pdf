import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Dialogue - Chat with Your PDFs using AI | AI PDF Assistant",
  description:
    "PDF Dialogue is an AI-powered tool that lets you chat with your PDFs and extract information instantly. Enhance your productivity with our intelligent PDF assistant.",
  keywords:
    "Chat with PDF, AI PDF Assistant, PDF Dialogue, AI-powered PDF tool, interact with PDF, AI chat with PDF, PDF AI",
  openGraph: {
    title: "PDF Dialogue - Chat with Your PDFs using AI | AI PDF Assistant",
    description:
      "With PDF Dialogue, you can effortlessly chat with your PDFs, extract information, and interact with your documents using AI.",
    url: "https://www.pdfdialogue.com",
    type: "website",
    siteName: "PDF Dialogue",
  },
  robots: "index, follow",
  twitter: {
    card: "summary_large_image",
    title: "PDF Dialogue - AI PDF Assistant",
    description:
      "Chat with PDFs using AI. Get answers instantly and interact with your documents through our PDF AI assistant.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          <Toaster />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
