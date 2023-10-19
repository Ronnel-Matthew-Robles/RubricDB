import { RubricList } from '@/page-components/RubricList';
import { Filter } from '@/components/Filter';
import Head from 'next/head';

import { MainLayout } from '@/components/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { useState, useEffect } from 'react';

import { usePublishedRubrics } from '@/lib/rubric';
import { useDepartments } from '@/lib/department';

const BrowseRubricsPage = () => {
  const publishedRubricsResponse = usePublishedRubrics();
  const publishedRubrics = publishedRubricsResponse.data;

  const departmentsFromDB = useDepartments();
  const departments = departmentsFromDB.data;

  const [filter, setFilter] = useState(null);
  const [rubrics, setRubrics] = useState(publishedRubrics);

  useEffect(() => {
    setRubrics([]);
  }, [filter]);

  if (!rubrics || !departments) {
    return (
      <>
        <Head>
          <title>Browse Rubrics</title>
        </Head>
        <Filter tags={[]} isLoading={true}/>
        <RubricList loading={true} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Browse Rubrics</title>
      </Head>
      <Filter tags={departments?.departments} setFilter={setFilter}/>
      <RubricList rubrics={rubrics?.rubrics || publishedRubrics?.rubrics}/>
    </>
  );
};

export default BrowseRubricsPage;

BrowseRubricsPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`Rubrics`}
        description={`This page shows the list of rubrics present in the database. Each rubric contains the title, activity, and the criteria used in the construction of the rubric.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
