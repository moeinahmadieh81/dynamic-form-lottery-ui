import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { useAuth } from '../auth/AuthContext';
import { AuthShell } from '../components/AuthShell';

interface LoginValues { email: string; password: string; }

export function LoginPage() {
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  });

  if (authenticated) return <Navigate to="/" replace />;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const user = await login(values);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from ?? (user.role === 'ADMIN' ? '/admin' : '/forms'), { replace: true });
    } catch (e) { setError(getApiErrorMessage(e)); }
  });

  return (
    <AuthShell>
      <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
        <Stack spacing={0.7}>
          <Typography variant="h4">خوش اومدی 👋</Typography>
          <Typography color="text.secondary">برای ادامه وارد حساب کاربری‌ات شو.</Typography>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="ایمیل" type="email" autoComplete="email" {...register('email', { required: true })} />
        <TextField label="رمز عبور" type="password" autoComplete="current-password" {...register('password', { required: true })} />
        <Button type="submit" variant="contained" size="large" startIcon={<LoginRoundedIcon />} disabled={isSubmitting}>
          {isSubmitting ? 'در حال ورود...' : 'ورود به فرمینو'}
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          حساب نداری؟ <Link component={RouterLink} to="/register" fontWeight={800}>ثبت‌نام کن</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
