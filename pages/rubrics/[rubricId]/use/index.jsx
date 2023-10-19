import { Calculator } from "@/page-components/Calculator";
import Head from "next/head";

import { MainLayout } from "@/components/MainLayout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';

import { findRubricById } from "@/api-lib/db";

const RubricPage = ({ rubric }) => {
  return (
    <>
      <Head>
        <title>{rubric.title}</title>
      </Head>
      <Calculator rubric={rubric} />
    </>
  );
};

export default RubricPage;

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const rubric = await findRubricById(context.req.db, context.params.rubricId)

  return { props: { rubric: JSON.parse(JSON.stringify(rubric)), rubricId: context.params.rubricId } };
}

RubricPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`Calculator`}
        description={`Here you can use the rubric, automatically calculate scores, and keep a list of scores of the class.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
