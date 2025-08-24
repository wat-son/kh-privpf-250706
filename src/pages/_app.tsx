import type { AppProps } from 'next/app';
import '../styles/globals.css'; // 必要なら作成
import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
  <>
    <SessionProvider session={session}>
      {/* <Header/> */}
      <Component {...pageProps} />
    </SessionProvider>
  </>
  )
}
