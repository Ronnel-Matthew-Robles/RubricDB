import { findUserByUsername } from '@/api-lib/db';
import { RubricList } from '@/page-components/RubricList';
import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';
import Head from 'next/head';
import {useState, useEffect} from 'react';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export default function MyRubricsPage({ user }) {
  const [rubrics, setRubrics] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch(`/api/user/${user._id}/rubrics`)
      .then((res) => res.json())
      .then((data) => {
        setRubrics(data.rubrics)
        setLoading(false)
      })
  }, [])

  if (isLoading) {
      return (
        <>
          <Head>
            <title>My Rubrics</title>
          </Head>
          <RubricList rubrics={[]} loading={isLoading}/>
        </>
      );
  }

  return (
    <>
      <Head>
        <title>My Rubrics</title>
      </Head>
      <RubricList rubrics={rubrics} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const user = await findUserByUsername(
    context.req.db,
    context.params.username
  );
  if (!user) {
    return {
      notFound: true,
    };
  }
  user._id = String(user._id);
  return { props: { user: JSON.parse(JSON.stringify(user)) } };
}

MyRubricsPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`My Rubrics`}
        description={`This page shows a list of the rubrics submitted by the user for approval by the admin.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
