import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Logo from 'src/components/logo';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { bgBlur } from '../../utils/cssStyles';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const navItems = ['Home', 'About Us', 'How we work', 'Startup Advice', 'Join Us'];
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${drawerWidth + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
    justifyContent: 'space-between', // Align items to the center and space-between
  },
}));

function DrawerAppBar(props) {
  const navigate = useNavigate();

  function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }

  ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNavChange = (item) => {
    switch (item) {
      case 'Home':
        navigate('/landingpage/home');
        break;

      case 'About Us':
        navigate('/landingpage/aboutUs');
        break;

      case 'How we work':
        navigate('/landingpage/howWeWork');
        break;

      case 'Startup Advice':
        navigate('/landingpage/startupAdvice');
        break;

      case 'Join Us':
        navigate('/landingpage/joinUs');
        break;

      default:
        break;
    }
  };
  const drawer = (
    <StyledRoot>
      <StyledToolbar>
        <Box sx={{ textAlign: 'center' }}>
          <Logo
            component="div"
            sx={{
              position: 'fixed',
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}
          />
        </Box>
        <List>
          {navItems.map((item, index) => (
            <ListItem key={item} disablePadding>
              <ListItemButton onClick={() => handleNavChange(item)}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledToolbar>
    </StyledRoot>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar component="nav" sx={{ backgroundColor: 'white' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
            <Logo
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block' },
              }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{ color: 'black', fontSize: '15px', paddingLeft: '30px' }}
                  onClick={() => handleNavChange(item)}
                >
                  {item}
                </Button>
              ))}
            </Box>
            <Box flexGrow={1} />
            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
              <Button onClick={() => navigate('/register')} variant="outlined">
                Sign Up
              </Button>
              <Button variant="contained" sx={{ bgcolor: 'green', color: 'white' }} onClick={() => navigate('/landingpage/donations')}>
                Donate Now
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
