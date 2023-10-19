import { CriteriaList } from '@/page-components/CriteriaList';
import Head from 'next/head';

import { useCurrentUser } from '@/lib/user';
import { useCurrentUserCriteria } from '@/lib/criterion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetcher } from '@/lib/fetch';
import useSWR from 'swr'

import toast from 'react-hot-toast';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const MyCriteriaPage = () => {
  const { data, error } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!data && !error) return;

    // const {criteria} = useSWR(`/api/criteria/${data.user._id}`, fetcher);
  }, [data, error]);

  let criteria = [
    {
      title: 'Communication',
      _id: 1,
      activity: { name: 'Essay' },
      createdAt: new Date(),
      status: {
          name: "Pending"
      },
      c4: "This is E",
      c3: "This is G",
      c2: "This is S",
      c1: "This is NI",
      creator: {
        name: 'Matt Robles',
      },
    },
    {
        title: 'Organization',
        _id: 2,
        activity: { name: 'Essay' },
        createdAt: new Date(),
        status: {
            name: "Approved"
        },
        c4: "This is E",
        c3: "This is G",
        c2: "This is S",
        c1: "This is NI",
        creator: {
          name: 'Matt Robles',
        },
      },
  ];

  return (
    <>
      <Head>
        <title>My Criteria</title>
      </Head>
      <CriteriaList criteria={criteria} loading={isLoading} />
    </>
  );
};

export default MyCriteriaPage;

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
