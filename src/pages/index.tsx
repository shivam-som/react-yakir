import Carousel from '@/components/Carousel'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Carousel App</title>
        <meta name="description" content="2d 3d Carousel App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Carousel />
      </div>
    </>
  )
}
