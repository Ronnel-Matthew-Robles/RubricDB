import { Rubric } from '@/page-components/Rubric';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetch';

const RubricPage = ({rubricId}) => {
  const {data, error, mutate} = useSWR(`/api/rubric/${rubricId}`, fetcher);

  if (!data) {
    return (
      <>
        <Head>
          <title>Rubric</title>
        </Head>
        <Rubric loading={true}/>
      </>
    );
  }

  if (error) {
    return <p>Error</p>
  }

  return (
    <>
      <Head>
        <title>{data.rubric.title}</title>
      </Head>
      <Rubric rubric={data.rubric} updateRubric={mutate}/>
    </>
  );
};

export default RubricPage;

export async function getServerSideProps(context) {
  return { props: { rubricId: context.params.rubricId } };
}

RubricPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`Rubric`}
        description={`This page shows the details of the rubric including the title, activity, and the different descriptions of the 4-point system. If you choose to use this rubric, you may press 'Download' to download the pdf version of the rubric.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
