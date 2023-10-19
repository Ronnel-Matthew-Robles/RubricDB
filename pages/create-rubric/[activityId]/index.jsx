import { findActivityById } from '@/api-lib/db';

import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';

import { RubricGenerator } from '@/page-components/Generator';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const CreateRubricPage = ({activities}) => {
  return (
    <>
      <Head>
        <title>Create Rubric - {activities[0].name}</title>
      </Head>
      <RubricGenerator activities={activities}/>
    </>
  );
};

export default CreateRubricPage;

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const activity = await findActivityById(context.req.db, context.params.activityId);
  const activities = [activity];
  return { props: { activities: JSON.parse(JSON.stringify(activities)) } };
}

CreateRubricPage.getLayout = function getLayout(page) {
    return (
      <ThemeProvider>
        <MainLayout title={`Create Rubric`} description={`This page is where teachers can generate the rubric using approved criteria. First, select the activity of the rubric and then input the title. Next, select the approved criteria from the dropdown to construct the rubric. After, hit 'Create' to download the rubric in PDF file format.`}>
          {page}
        <Toaster />
        </MainLayout>
      </ThemeProvider>
    )
  }