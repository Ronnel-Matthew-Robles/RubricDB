// import { findCriterionById } from '@/api-lib/db';
import { Criterion } from '@/page-components/Criterion';
import Head from 'next/head';

import { useCriterion } from '@/lib/criterion';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const CriteriaPage = ({criterionId}) => {
  const {data, error, mutate} = useCriterion(criterionId);

  if (!data) {
    return (
      <>
        <Head>
          <title>Criterion</title>
        </Head>
        <Criterion loading={true}/>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{data.criterion.title} - {data.criterion.activity.name}</title>
      </Head>
      <Criterion criterion={data.criterion} updateCriterion={mutate}/>
    </>
  );
};

export default CriteriaPage;

export async function getServerSideProps(context) {
  return { props: { criterionId: context.params.criterionId } };
}

CriteriaPage.getLayout = function getLayout(page) {
    return (
      <ThemeProvider>
        <MainLayout title={`Criterion`} description={`This page shows the details of a specific criterion in the database.`}>
          {page}
        <Toaster />
        </MainLayout>
      </ThemeProvider>
    )
  }