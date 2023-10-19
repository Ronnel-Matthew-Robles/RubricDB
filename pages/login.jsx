import { Login } from '@/page-components/Auth';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </>
  );
};

export default LoginPage;

LoginPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}