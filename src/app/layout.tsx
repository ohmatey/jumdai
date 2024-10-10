import type { Metadata } from 'next'
import { Bai_Jamjuree } from 'next/font/google'
import './globals.css'

import AppBar from './AppBar'

const font = Bai_Jamjuree({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Jumdai',
  description: 'Your favorite Thai language learning app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${font.className} antialiased`}
      >
        <AppBar />

        {children}
      </body>
    </html>
  )
}
