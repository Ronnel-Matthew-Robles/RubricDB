import { findTokenByIdAndType } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ForgetPasswordToken } from '@/page-components/ForgetPassword';
import nc from 'next-connect';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const ResetPasswordTokenPage = ({ valid, token }) => {
  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <ForgetPasswordToken valid={valid} token={token} />
    </>
  );
};

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const tokenDoc = await findTokenByIdAndType(
    context.req.db,
    context.params.token,
    'passwordReset'
  );

  return { props: { token: context.params.token, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;

ResetPasswordTokenPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}