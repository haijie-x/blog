import Link from "next/link"
import "./global.css"
import { Inter } from "next/font/google"
import ModeToggle from "@/components/mode-toggle"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen bg-white text-slate-900 ${inter.className}`}
      >
        <div className="max-w-2xl mx-auto py-10 px-4">
          <header>
            <div className="flex items-center justify-between">
              <ModeToggle />
              <nav className="ml-auto text-sm font-medium space-x-6">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-10">
            <hr className="my-4" />
            <small>@ Hai</small>
          </footer>
        </div>
      </body>
    </html>
  )
}
