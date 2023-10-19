import { SubmitCriterion } from '@/page-components/SubmitCriterion';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { getActivities } from '@/lib/activity/util';

const SubmitCriteriaPage = ({activities}) => {
  return (
    <>
      <Head>
        <title>Submit Criterion</title>
      </Head>
      <SubmitCriterion  activities={activities}/>
    </>
  );
};

export default SubmitCriteriaPage;

export async function getStaticProps() {
  const activities = await getActivities();

  return {
    props: {
      activities,
    },
  }
}

SubmitCriteriaPage.getLayout = function getLayout(page) {
    return (
      <ThemeProvider>
        <MainLayout title={`Submit Criterion`} description={`This page is where teachers can submit a criterion for approval to the admin. Please indicate the title, activity, and the details of the criteria in the form below.`}>
          {page}
        <Toaster />
        </MainLayout>
      </ThemeProvider>
    )
  }