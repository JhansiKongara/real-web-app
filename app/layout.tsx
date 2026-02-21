import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/layout/footer";
import Header from "@/app/components/layout/header";
import { ThemeProvider } from "@/app/context/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Premium Open Plots in Hyderabad | Buy & Sell Real Estate",
  description:
    "Discover the best open plots, lands, and properties in Hyderabad. Buy and sell HMDA, DTCP approved layouts with ease. Trusted real estate portal.",
  keywords:
    "open plots in hyderabad, real estate hyderabad, buy land, sell plots, HMDA plots, DTCP layouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans m-0 antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="midnight"
          themes={[
            "midnight",
            "solar",
            "light",
            "cyberpunk",
            "emerald",
            "amethyst",
          ]}
          enableSystem={false}
          storageKey="real-estate-theme"
          disableTransitionOnChange
        >
          {/* Fixed Header */}
          <Header />

          {/* Main content with padding-top to avoid overlap */}
          <main className="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
