import Layout from '@/components/Layout';
import { ThemeProvider } from '@theme-ui/theme-provider';
import '../styles/globals.css'
import { theme } from './theme';

function MyApp({ Component, pageProps }) {

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp
