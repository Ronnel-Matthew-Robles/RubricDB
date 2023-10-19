import { Dashboard } from '@/page-components/Dashboard';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import { useCurrentUser } from "@/lib/user";

const DashboardPage = () => {
  const [frequentTopics, setFrequentTopics] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [latestRubrics, setLatestRubrics] = useState(null);

  const { data, error, mutate } = useCurrentUser();

  useEffect(() => {
    fetch('/api/activity/frequent-topics')
      .then((res) => res.json())
      .then((data) => setFrequentTopics(data.activities));

    fetch('/api/quick-stats')
      .then((res) => res.json())
      .then((data) => setQuickStats(data.quickStats));

    fetch('/api/departments/rubrics', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deptId: data.user.department,
        userId: data.user._id
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setLatestRubrics(data.rubrics)})
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Dashboard frequentTopics={frequentTopics} latestRubrics={latestRubrics} quickStats={quickStats}/>
    </>
  );
};

export default DashboardPage;

DashboardPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`Dashboard`}
        description={`This page details what the application is all about and helps users get started.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
