import { SignUp } from '@/page-components/Auth';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { useDepartments } from '@/lib/department';

const SignupPage = () => {
  const {data} = useDepartments();

  if (!data) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <SignUp departments={[]} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <SignUp departments={data.departments} />
    </>
  );
};

export default SignupPage;

SignupPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}