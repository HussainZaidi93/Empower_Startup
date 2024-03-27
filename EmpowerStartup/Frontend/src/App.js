// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import theme from './theme/theme';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
