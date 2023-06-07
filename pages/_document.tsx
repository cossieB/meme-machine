import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head >
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className='font-nunito bg-slate-800' >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}