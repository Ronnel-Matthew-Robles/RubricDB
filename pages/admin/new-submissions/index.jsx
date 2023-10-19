import { CriteriaList } from '@/page-components/CriteriaList';
import { RubricList } from '@/page-components/RubricList';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import toast from 'react-hot-toast';

import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePendingCriteria } from '@/lib/criterion';

import { useSWRConfig } from 'swr';

const NewSubmissionsPage = () => {
  const pendingCriteria = usePendingCriteria();
  const criteria = pendingCriteria.data;
  const pendingCriteriaMutate = pendingCriteria.mutate;

  const updateCriteria = () => {
    pendingCriteriaMutate();
  };

  if (!criteria) {
    return (
      <>
        <Head>
          <title>New Submissions</title>
        </Head>
        <CriteriaList loading={true}/>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>New Submissions</title>
      </Head>
      <CriteriaList criteria={criteria.criteria} updateCriteria={updateCriteria}/>
    </>
  );
};

export default NewSubmissionsPage;

NewSubmissionsPage.getLayout = function getLayout(page) {
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace("/login");
    }
    if (!data.user?.isAdmin) {
      toast.error(`You don't have access to admin controls.`);
      router.replace("/dashboard");
    }
  }, [router, data, error]);
  
  return (
    <ThemeProvider>
      <MainLayout
        title={`New Submissions`}
        description={`This page shows the pending criteria in the database. This is where the admin can regulate the criteria submitted by the teachers.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
