import type { AppProps } from 'next/app';
import '../styles/globals.css'; // 必要なら作成
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
  <>
    <Header/>
    <Component {...pageProps} />
  </>
  )
}
