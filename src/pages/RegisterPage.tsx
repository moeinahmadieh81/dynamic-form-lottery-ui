import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { useAuth } from '../auth/AuthContext';
import { AuthShell } from '../components/AuthShell';

interface RegisterValues { displayName: string; email: string; password: string; }

export function RegisterPage() {
  const { register: registerUser, authenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterValues>();

  if (authenticated) return <Navigate to="/" replace />;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try { await registerUser(values); navigate('/forms', { replace: true }); }
    catch (e) { setError(getApiErrorMessage(e)); }
  });

  return (
    <AuthShell>
      <Stack component="form" spacing={2.35} onSubmit={onSubmit}>
        <Stack spacing={0.7}>
          <Typography variant="h4">حسابت رو بساز ✨</Typography>
          <Typography color="text.secondary">چند ثانیه تا شروع فاصله داری.</Typography>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="نام نمایشی" {...register('displayName', { required: true })} />
        <TextField label="ایمیل" type="email" autoComplete="email" {...register('email', { required: true })} />
        <TextField label="رمز عبور" type="password" autoComplete="new-password" helperText="حداقل ۸ کاراکتر" {...register('password', { required: true, minLength: 8 })} />
        <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAlt1RoundedIcon />} disabled={isSubmitting}>
          {isSubmitting ? 'در حال ساخت حساب...' : 'ساخت حساب کاربری'}
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          حساب داری؟ <Link component={RouterLink} to="/login" fontWeight={800}>وارد شو</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
