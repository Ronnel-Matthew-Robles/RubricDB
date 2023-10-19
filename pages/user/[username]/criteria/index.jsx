import { findUserByUsername } from '@/api-lib/db';
import { CriteriaList } from '@/page-components/CriteriaList';
import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import { useCurrentUserCriteria } from '@/lib/criterion';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export default function MyCriteriaPage({ user }) {
  const [criteria, setCriteria] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch(`/api/user/${user._id}/criteria`)
      .then((res) => res.json())
      .then((data) => {
        setCriteria(data.criteria)
        setLoading(false)
      })
  }, [])

  if (isLoading) {
      return (
        <>
          <Head>
            <title>My Criteria</title>
          </Head>
          <CriteriaList criteria={[]} loading={isLoading}/>
        </>
      );
  }

  return (
    <>
      <Head>
        <title>My Criteria</title>
      </Head>
      <CriteriaList criteria={criteria} />
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

MyCriteriaPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`My Criteria`}
        description={`This page shows a list of the criteria submitted by the user for approval by the admin.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
