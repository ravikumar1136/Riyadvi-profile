import React from "react"
import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MobileChatAssistant } from '@/components/mobile-chat-assistant'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Riyadvi Software Technologies | Digital Solutions for Growth',
  description: 'Custom software and digital solutions to grow your business. Web and app development, UI/UX design, and business strategy tailored to your needs.',
  keywords: ['custom software', 'web and app development', 'UI/UX design', 'business strategy', 'digital solutions'],
  authors: [{ name: 'Riyadvi Software Technologies' }],
  openGraph: {
    title: 'Riyadvi Software Technologies | Digital Solutions for Growth',
    description: 'Custom software and digital solutions to grow your business.',
    type: 'website',
    url: 'https://riyadvisoftwaretechnologies.com',
    siteName: 'Riyadvi Software Technologies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riyadvi Software Technologies | Digital Solutions for Growth',
    description: 'Custom software and digital solutions to grow your business.',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <MobileChatAssistant />
        <Analytics />
        <Script id="chatbase-loader" strategy="afterInteractive">
              {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="Vgo1sF-zU-ZT6p0PRfQe4";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
        </Script>
      </body>
    </html>
  )
}
