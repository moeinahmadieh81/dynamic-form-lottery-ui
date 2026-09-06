import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navButtonSx = (active: boolean) => ({
    borderRadius: 2.5,
    px: 1.7,
    color: active ? 'primary.main' : 'text.secondary',
    bgcolor: active ? alpha('#5B5BD6', 0.08) : 'transparent',
    '&:hover': { bgcolor: alpha('#5B5BD6', 0.08), color: 'primary.main' },
  });

  return (
    <Box
      minHeight="100vh"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          zIndex: -1,
          width: 520,
          height: 520,
          borderRadius: '50%',
          top: -300,
          right: -170,
          background: 'radial-gradient(circle, rgba(91,91,214,.12) 0%, rgba(91,91,214,0) 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          zIndex: -1,
          width: 440,
          height: 440,
          borderRadius: '50%',
          bottom: -260,
          left: -130,
          background: 'radial-gradient(circle, rgba(15,157,138,.09) 0%, rgba(15,157,138,0) 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha('#FFFFFF', 0.82),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 }, gap: 2 }}>
            <Stack
              component={RouterLink}
              to="/"
              direction="row"
              alignItems="center"
              gap={1.15}
              sx={{ textDecoration: 'none', color: 'text.primary', ml: { md: 2 } }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2.5,
                  color: 'common.white',
                  background: 'linear-gradient(135deg, #5B5BD6 0%, #7777EB 100%)',
                  boxShadow: '0 8px 22px rgba(91,91,214,.22)',
                }}
              >
                <AutoAwesomeRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography fontWeight={950} lineHeight={1.1}>فرمینو</Typography>
                <Typography variant="caption" color="text.secondary">فرم و قرعه‌کشی</Typography>
              </Box>
            </Stack>

            <Stack direction="row" gap={0.5} sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Button component={RouterLink} to="/forms" sx={navButtonSx(isActive('/forms'))}>فرم‌ها</Button>
              {user?.role === 'USER' && (
                <Button component={RouterLink} to="/my-submissions" sx={navButtonSx(isActive('/my-submissions'))}>
                  ثبت‌های من
                </Button>
              )}
              {user?.role === 'ADMIN' && (
                <Button component={RouterLink} to="/admin" sx={navButtonSx(isActive('/admin'))}>
                  مدیریت
                </Button>
              )}
            </Stack>

            <Stack direction="row" gap={1} alignItems="center">
              <Stack direction="row" gap={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: user?.role === 'ADMIN' ? 'primary.main' : 'secondary.main',
                    fontWeight: 900,
                    fontSize: 15,
                  }}
                >
                  {user?.displayName?.trim()?.[0] ?? 'U'}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={800}>{user?.displayName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role === 'ADMIN' ? 'مدیر سامانه' : 'کاربر'}
                  </Typography>
                </Box>
              </Stack>
              <Button
                color="error"
                onClick={logout}
                startIcon={<LogoutRoundedIcon />}
                sx={{ minWidth: { xs: 42, sm: 'auto' }, px: { xs: 1, sm: 1.5 } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>خروج</Box>
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
