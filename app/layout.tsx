import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Goluleaks.com - OSINT Search Engine',
  description: 'Goluleaks.com - Powerful OSINT data search and intelligence tool. Search across multiple databases with instant results and easy downloads.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_jetbrains.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
