import { Logo } from './components/Logo'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InfoJobs - Mejorador de descripciones',
  description: 'Una pequeña herramienta que te ayuda a mejorar las descripciones de las ofertas de InfoJobs'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <header className='py-10'>
          <h1 className='flex flex-col items-center justify-center text-lg'>
            <Logo />
            <strong className='font-semibold tracking-wider text-black/80'>Mejorador de descripciones</strong>
          </h1>
        </header>

        {children}
      </body>
    </html>
  )
}
