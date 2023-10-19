import { Settings } from '@/page-components/Settings';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const SettingPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <Settings />
    </>
  );
};

export default SettingPage;

SettingPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}