import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Index } from '@/page-components/Index';
import { Toaster } from 'react-hot-toast';

const IndexPage = () => {
  return <Index />;
};

export default IndexPage;

IndexPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <Layout>
        {page}
      <Toaster />
      </Layout>
    </ThemeProvider>
  )
}