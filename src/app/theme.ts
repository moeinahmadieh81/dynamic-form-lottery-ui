import { alpha, createTheme } from '@mui/material/styles';

const primary = '#5B5BD6';
const secondary = '#0F9D8A';

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: { main: primary, dark: '#4141B8', light: '#7B7BE8' },
    secondary: { main: secondary, dark: '#0B786A', light: '#35B7A5' },
    success: { main: '#16A06B' },
    warning: { main: '#E49A24' },
    error: { main: '#DE4B5F' },
    background: {
      default: '#F6F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C2030',
      secondary: '#6F7485',
    },
    divider: '#E8EAF1',
  },
  typography: {
    fontFamily: 'Vazirmatn, IRANSansX, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.04em' },
    h2: { fontWeight: 900, letterSpacing: '-0.035em' },
    h3: { fontWeight: 900, letterSpacing: '-0.03em' },
    h4: { fontWeight: 900, letterSpacing: '-0.025em' },
    h5: { fontWeight: 850 },
    h6: { fontWeight: 800 },
    button: { fontWeight: 800 },
  },
  shape: {
    borderRadius: 18,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(28,32,48,.04)',
    '0 4px 12px rgba(28,32,48,.06)',
    '0 8px 24px rgba(28,32,48,.08)',
    '0 12px 32px rgba(28,32,48,.10)',
    '0 18px 44px rgba(28,32,48,.12)',
    '0 20px 50px rgba(28,32,48,.13)',
    '0 22px 56px rgba(28,32,48,.14)',
    '0 24px 60px rgba(28,32,48,.15)',
    '0 26px 66px rgba(28,32,48,.16)',
    '0 28px 72px rgba(28,32,48,.17)',
    '0 30px 78px rgba(28,32,48,.18)',
    '0 32px 84px rgba(28,32,48,.19)',
    '0 34px 90px rgba(28,32,48,.20)',
    '0 36px 96px rgba(28,32,48,.21)',
    '0 38px 102px rgba(28,32,48,.22)',
    '0 40px 108px rgba(28,32,48,.23)',
    '0 42px 114px rgba(28,32,48,.24)',
    '0 44px 120px rgba(28,32,48,.25)',
    '0 46px 126px rgba(28,32,48,.26)',
    '0 48px 132px rgba(28,32,48,.27)',
    '0 50px 138px rgba(28,32,48,.28)',
    '0 52px 144px rgba(28,32,48,.29)',
    '0 54px 150px rgba(28,32,48,.30)',
    '0 56px 156px rgba(28,32,48,.31)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #F8F9FD 0%, #F5F7FB 45%, #F8FAFC 100%)',
        },
        '::selection': {
          backgroundColor: alpha(primary, 0.18),
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          minHeight: 40,
          paddingInline: 16,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primary} 0%, #6F6FE8 100%)`,
          boxShadow: `0 10px 24px ${alpha(primary, 0.22)}`,
          '&:hover': {
            background: `linear-gradient(135deg, #5050C7 0%, ${primary} 100%)`,
            boxShadow: `0 14px 30px ${alpha(primary, 0.28)}`,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#DFE2EB',
          backgroundColor: alpha('#FFFFFF', 0.74),
          '&:hover': { borderColor: alpha(primary, 0.42), backgroundColor: alpha(primary, 0.045) },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E9EBF2',
          boxShadow: '0 8px 28px rgba(35, 39, 64, .055)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 13,
          backgroundColor: '#FFF',
          transition: 'box-shadow .2s ease, border-color .2s ease',
          '&.Mui-focused': { boxShadow: `0 0 0 4px ${alpha(primary, 0.08)}` },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 750 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 48 },
        indicator: { height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { minHeight: 48, fontWeight: 800, textTransform: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 850, color: '#42475A', backgroundColor: '#F8F9FC' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 22, boxShadow: '0 24px 70px rgba(28,32,48,.18)' },
      },
    },
  },
});
