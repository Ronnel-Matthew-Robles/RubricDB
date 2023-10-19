import { Feed } from '@/page-components/Feed';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const FeedPage = () => {
  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <Feed />
    </>
  );
};

export default FeedPage;

FeedPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}