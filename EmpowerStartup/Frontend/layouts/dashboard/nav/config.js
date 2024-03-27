import {
  AddBusiness,
  Article,
  CardGiftcard,
  ClearAll,
  Details,
  FindInPage,
  FormatListBulleted,
  History,
  Inventory2,
  LocalMall,
  LocalShipping,
  MarkAsUnreadOutlined,
  MonitorHeart,
  Shield,
  ShoppingCartOutlined,
  VerifiedUser,
  VolunteerActivism,
} from '@mui/icons-material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// // ----------------------------------------------------------------------

const supplierNavConfig = [
  {
    title: 'Catalog',
    path: '/supplier-dashboard/app',
    icon: <CardGiftcard />,
  },
  {
    title: 'Order Details',
    path: '/supplier-dashboard/orderDetails',
    icon: <Details />,
  },
  {
    title: 'Products',
    path: '/supplier-dashboard/products',
    icon: <Inventory2 />,
  },
];

const startupNavConfig = [
  {
    title: 'Applications',
    path: '/innovator-dashboard/app',
    icon: <MarkAsUnreadOutlined />,
  },
  {
    title: 'Input Inventory',
    path: '/innovator-dashboard/inventory',
    icon: <ShoppingCartOutlined />,
  },
  {
    title: 'Place Order',
    path: '/innovator-dashboard/placeOrder',
    icon: <LocalMall />,
  },
  {
    title: 'Your Progress',
    path: '/innovator-dashboard/progress',
    icon: <Shield />,
  },
  {
    title: 'History',
    path: '/innovator-dashboard/history',
    icon: <History />,
  },
];
const adminNavConfig = [
  {
    title: 'dashboard',
    path: '/admin-dashboard/app',
    icon: <AnalyticsIcon />,
  },
  {
    title: 'startups',
    path: '/admin-dashboard/startup-user',
    icon: <AddBusiness />,
  },
  {
    title: 'suppliers',
    path: '/admin-dashboard/suppliers',
    icon: <LocalShipping />,
  },
  {
    title: 'auditor',
    path: '/admin-dashboard/auditor',
    icon: <FindInPage />,
  },
  {
    title: 'Inspection',
    path: '/admin-dashboard/inspection',
    icon: <FindInPage />,
  },
  // {
  //   title: 'monitor startup',
  //   path: '/admin-dashboard/monitor',
  //   icon: <MonitorHeart />,
  // },
  {
    title: 'Orders',
    path: '/admin-dashboard/orders',
    icon: <ClearAll />,
  },
  {
    title: 'Donation',
    path: '/admin-dashboard/donation',
    icon: <VolunteerActivism />,
  },
  {
    title: 'Donation article',
    path: '/admin-dashboard/write-article',
    icon: <Article />,
  },
];

const auditorNavConfig = [
  {
    title: 'List of Startups',
    path: '/auditor-dashboard/app',
    icon: <FormatListBulleted />,
  },
  {
    title: 'Place Audit',
    path: '/auditor-dashboard/placeAudit',
    icon: <VerifiedUser />,
  },

];
const inspectionNavConfig = [
  {
    title: 'Startups',
    path: '/inspection-dashboard/app',
    icon: <FormatListBulleted />,
  },
  {
    title: 'Inspection Details',
    path: '/inspection-dashboard/inspections',
    icon: <VerifiedUser />,
  },

];

export default supplierNavConfig;
export { startupNavConfig };
export { adminNavConfig };
export { auditorNavConfig };
export { inspectionNavConfig };