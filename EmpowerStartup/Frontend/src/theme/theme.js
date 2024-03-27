import { colors, createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: '#233044',
      light: '#f33333',
      dark: '#1e293a',
      contrastText: '#eeeeee',
      orange: '#FF8A00',
      whitee: ' #FFFFFF',
    },
    secondary: {
      main: '#333',
      dark: '#232323',
      light: '#5b5b5b',
      contrastText: '#ffffff',
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600],
    },
    shadows: {
      0: 'none',
      1: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
      2: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
      3: '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
      4: '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
      5: '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
    },
    typography: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 700,
            fontSize: 35,
            letterSpacing: '-0.24px',
        },
        h2: {
            fontWeight: 700,
            fontSize: 29,
            letterSpacing: '-0.24px',
        },
        h3: {
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.06px',
        },
        h4: {
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '-0.06px',
        },
        h5: {
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.05px',
        },
        h6: {
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '-0.05px',
        },
        subtitle1: {
            fontSize: 16,
            letterSpacing: '-0.05px',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '-0.05px',
        },
        body1: {
            fontSize: 16,
            letterSpacing: '-0.05px',
        },
        body2: {
            fontSize: 14,
            letterSpacing: '-0.04px',
        },
        button: {
            fontWeight: 700,
        },
        caption: {
            fontSize: 12,
            letterSpacing: '0.4px',
        }, 
        overline: {
            fontSize: 10,
            letterSpacing: '1.5px',
        },
    },
    },
    shape: {
        borderRadius: 8,
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
    props: {},
    overrides: {},
});


theme.props = {
  MuiButton: {
    disableElevation: true,
  },
};

theme.overrides = {
  MuiButton: {
    root: {
      textTransform: 'none',
    },
  },
};

export default theme;
