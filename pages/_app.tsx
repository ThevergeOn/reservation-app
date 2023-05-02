import { Provider as AuthProvider } from 'next-auth/client'
import type { AppProps } from 'next/app'

import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}