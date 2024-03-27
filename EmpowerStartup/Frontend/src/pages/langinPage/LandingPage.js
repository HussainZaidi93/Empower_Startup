import React from 'react';
import DrawerAppBar from './Appbar';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 72;
const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
const LandingPage = () => {
  return (
    <>
      <DrawerAppBar />
      <Main>
        <Outlet />
      </Main>
    </>
  );
};
export default LandingPage;
