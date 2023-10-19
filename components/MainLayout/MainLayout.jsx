import Head from 'next/head';
import Wrapper from '@/components/MainLayout/Wrapper';
import TopBar from '@/components/MainLayout/TopBar';
import LeftSidebar from '@/components/MainLayout/LeftSidebar';
import PageWrapper from './PageWrapper';
import PageBreadcrumb from './PageBreadcrumb';
import ContainerFluid from './ContainerFluid';
import Footer from '@/components/MainLayout/Footer';
import styles from '@/components/Layout/Layout.module.css';

import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import toast from 'react-hot-toast';

const MainLayout = ({ title, description, children }) => {
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      toast.error(`You need to login first`);
      router.replace("/login");
    } else if (!data.user?.emailVerified) {
      toast.error(`You need to verify your email first`);
      router.replace("/");
    }
  }, [router, data, error]);

  return (
    <>
      <Head>
        <title>Rubric Database - LPU Laguna</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="The LPU-Laguna Rubric database is used to store, retrieve, and approve criteria and rubrics."
        />
        <meta property="og:title" content="Rubric Database - LPU Laguna" />
        <meta
          property="og:description"
          content="The LPU-Laguna Rubric database is used to store, retrieve, and approve criteria and rubrics."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dqlsfa0ee/image/upload/v1654004023/RubricDB-Preview_qyfwc2.png"
        />
      </Head>
      <Wrapper>
        <TopBar/>
        <LeftSidebar />
        <PageWrapper>
        <PageBreadcrumb title={title} description={description}/>
        <ContainerFluid>
          {children}
        </ContainerFluid>
        <Footer />
        </PageWrapper>
      </Wrapper>
    </>
  );
};

export default MainLayout;
