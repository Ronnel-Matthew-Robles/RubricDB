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
import { useApprovedCriteria } from '@/lib/criterion';

const ApprovedSubmissionsPage = () => {
  const approvedCriteria = useApprovedCriteria();
  const criteria = approvedCriteria.data;
  const approvedCriteriaMutate = approvedCriteria.mutate;

  const updateCriteria = () => {
    approvedCriteriaMutate();
  };

  if (!criteria) {
    return (
      <>
        <Head>
          <title>Approved Submissions</title>
        </Head>
        <CriteriaList loading={true}/>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Approved Submissions</title>
      </Head>
      <CriteriaList criteria={criteria.criteria} updateCriteria={updateCriteria}/>
    </>
  );
};

export default ApprovedSubmissionsPage;

ApprovedSubmissionsPage.getLayout = function getLayout(page) {
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
        title={`Approved Submissions`}
        description={`This page shows the approved submissions in the database.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
