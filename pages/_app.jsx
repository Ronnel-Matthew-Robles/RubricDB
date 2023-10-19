import '@/assets/base.css';
import '@/assets/style.min.css';
import '@/assets/bootstrap.css';
import '@/assets/chartist.min.css';
import '@/assets/chartist-plugin-tooltip.css';

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
