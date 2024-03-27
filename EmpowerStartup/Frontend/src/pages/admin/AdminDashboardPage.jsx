import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { AdminDashboardSection } from 'src/sections/@dashboard';
// components

// sections

// ----------------------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | SE </title>
      </Helmet>

      <Container maxWidth="xl">
        <AdminDashboardSection />
      </Container>
    </>
  );
}
