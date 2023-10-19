import Head from 'next/head';
import Footer from './Footer';
import styles from './Layout.module.css';
import Nav from './Nav';

const Layout = ({ children }) => {
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
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
