import ExploreOffRoundedIcon from '@mui/icons-material/ExploreOffRounded';
import { Box, Button, Stack, Typography } from '@mui/material';
import { BackButton } from '../components/BackButton';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack spacing={2.5} alignItems="center" py={8} textAlign="center">
      <Box sx={{ width: 82, height: 82, borderRadius: 4, display: 'grid', placeItems: 'center', bgcolor: 'rgba(91,91,214,.08)', color: 'primary.main' }}>
        <ExploreOffRoundedIcon sx={{ fontSize: 42 }} />
      </Box>
      <Typography variant="h2" color="primary.main">404</Typography>
      <Typography variant="h5">اینجا چیزی پیدا نکردیم!</Typography>
      <Typography color="text.secondary">ممکنه آدرس تغییر کرده باشه یا صفحه حذف شده باشه.</Typography>
      <Stack direction="row" gap={1}>
        <BackButton />
        <Button component={RouterLink} to="/" variant="contained">صفحه اصلی</Button>
      </Stack>
    </Stack>
  );
}
