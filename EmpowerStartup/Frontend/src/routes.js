import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import { ForgetPasswordPage, LoginPage, RegisterPage } from './pages/auth';
// import VerifiedAccountPage from './pages/auth/';
import CheckEmailForVerification from './pages/auth/CheckEmailForVerification';

import Page404 from './pages/Page404';
import { SupplierHomePage } from './pages/supplier';
import { OrderPlacing, StartUpHomePage, StartupUserHistroy, StartupUserProgress, UserInventory } from './pages/startup';
import {
  AdminDashboardPage,
  DonationArtilcePage,
  DonationsPage,
  MonitorStartupPage,
  AuditorPage,
  SupplierPage,
  StartupUserPage,
  InspectorPage,
  OrdersPage,
} from './pages/admin';
import { OrderDetails, SupplierProducts } from './sections/supplier';
import AuditorHomePage from './pages/auditor/AuditorHomePage';
import { PlaceAudit } from './sections/auditor';
import { LandingPage } from './pages/langinPage';
import { AboutUspage, DonationPage, HomePage, HowWeWorkPage, JoinUsPage, StartupAdvicePage } from './pages/langinPage/components';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { InspectionDetails, InspectionHomePage } from './pages/admin/inspection';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    // Supplier Routes

    {
      path: '/supplier-dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/supplier-dashboard/app" />, index: true },
        { path: 'app', element: <SupplierHomePage /> },
        { path: 'orderDetails', element: <OrderDetails /> },
        { path: 'products', element: <SupplierProducts /> },
      ],
    },

    //auditor routes
    {
      path: '/auditor-dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/auditor-dashboard/app" />, index: true },
        { path: 'app', element: <AuditorHomePage /> },
        { path: 'placeAudit', element: <PlaceAudit /> },
      ],
    },
    //inspection routes
    {
      path: '/inspection-dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/inspection-dashboard/app" />, index: true },
        { path: 'app', element: <InspectionHomePage /> },
        { path: 'inspections', element: <InspectionDetails /> },
      ],
    },

    //startup routes
    {
      path: '/innovator-dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/innovator-dashboard/app" />, index: true },
        { path: 'app', element: <StartUpHomePage /> },
        { path: 'inventory', element: <UserInventory /> },
        { path: 'placeOrder', element: <OrderPlacing /> },
        { path: 'progress', element: <StartupUserProgress /> },
        { path: 'history', element: <StartupUserHistroy /> },
      ],
    },
    {
      path: '/admin-dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/admin-dashboard/app" />, index: true },
        { path: 'app', element: <AdminDashboardPage /> },
        { path: 'startup-user', element: <StartupUserPage /> },
        { path: 'suppliers', element: <SupplierPage /> },
        { path: 'auditor', element: <AuditorPage /> },
        { path: 'inspection', element: <InspectorPage /> },
        // { path: 'monitor', element: <MonitorStartupPage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'donation', element: <DonationsPage /> },
        { path: 'write-article', element: <DonationArtilcePage /> },
      ],
    },
    //landing page routes
    {
      path: '/landingpage',
      element: <LandingPage />,
      children: [
        { element: <Navigate to="/landingpage/home" />, index: true },
        { path: 'home', element: <HomePage /> },
        { path: 'howWeWork', element: <HowWeWorkPage /> },
        { path: 'startupAdvice', element: <StartupAdvicePage /> },
        { path: 'aboutUs', element: <AboutUspage /> },
        { path: 'joinUs', element: <JoinUsPage /> },
        { path: 'donations', element: <DonationPage /> },
      ],
    },
    // {
    //   path: 'verify/:verificationtoken',
    //   element: <VerifiedAccountPage />,
    // },
    {
      path: 'forgetPassword',
      element: <ForgetPasswordPage />,
    },
    {
      path: 'resetpassword',
      element: <ResetPasswordPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'home',
      element: <LandingPage />,
    },
    {
      path: 'verifyEmail',
      element: <CheckEmailForVerification />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/landingpage" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },

    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
