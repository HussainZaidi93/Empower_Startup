import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
// import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import supplierNavConfig, { adminNavConfig, auditorNavConfig, inspectionNavConfig, startupNavConfig } from './config';
import logo from 'src/images/logo.png';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetUserById_URL, baseURL } from 'src/constants/apiURLs';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
const initial_color = "#80f0ff";

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const isDesktop = useResponsive('up', 'lg');
  const [accountInfo, setAccountInfo] = useState({
    fullName: '',
    email: '',
    role: '',
    profileImage: '',
  });

  const getUserById = useCallback(() => {
    Post(
      {
        userId: userId.toString(),
      },
      Post_GetUserById_URL,
      (resp) => {
        console.log('kjadshgfodsafdsafdsf', `${baseURL}${resp.data.profileImage}`);
        const currentUser = {
          fullName: resp.data.fullName,
          email: resp.data.email,
          role: resp.data.role,
          profileImage: `${baseURL}${resp.data.profileImage}`,
          startupType: resp.data.startupType,
        };
        setAccountInfo(currentUser);
        localStorage.setItem('imageUrl', `${baseURL}${resp.data.profileImage}`);
      },
      (error) => {
        setAccountInfo({
          fullName: account.fullName,
          email: account.email,
        });
      }
    );
  }, [userId]);
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    getUserById();
  }, [pathname, getUserById, onCloseNav, openNav]);

  // get user role from local storage

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link to="/" component={RouterLink}>
          <img src={logo} alt="Logo" height={150} width={200} />
        </Link>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={accountInfo.profileImage} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {accountInfo.fullName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {accountInfo.role} {accountInfo?.startupType&&` - ${accountInfo?.startupType}`}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection
        data={
          role === 'Admin'
            ? adminNavConfig
            : role === 'User'
            ? startupNavConfig
            : role === 'Supplier'
            ? supplierNavConfig
            : role === 'Auditor'
            ? auditorNavConfig
            : role === 'Inspector'
            ? inspectionNavConfig
            : null
        }
      />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box sx={{ textAlign: 'center' }}>
            <div>
              <p>
                &copy; {new Date().getFullYear()} <span style={{ fontWeight: 'bolder' }}>Startup Empowerment</span> All
                Rights Reserved.
              </p>
            </div>
          </Box>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
        backgroundColor: initial_color,
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
