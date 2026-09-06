import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Alert, Box, Card, CardContent, Pagination, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BackButton } from '../components/BackButton';
import { getApiErrorMessage } from '../api/error';
import { FormStatusChip } from '../components/FormStatusChip';
import { listMySubmissions } from '../features/submissions/submissionsApi';

export function MySubmissionsPage() {
  const [page, setPage] = useState(0);
  const query = useQuery({ queryKey: ['my-submissions', page], queryFn: () => listMySubmissions(page, 10) });
  if (query.isError) return <Alert severity="error">{getApiErrorMessage(query.error)}</Alert>;

  return (
    <Stack spacing={3}>
      <BackButton to="/forms" label="بازگشت به فرم‌ها" />
      <Stack direction="row" gap={2} alignItems="center">
        <Box sx={{ width: 52, height: 52, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: alpha('#5B5BD6', .08), color: 'primary.main' }}>
          <HistoryRoundedIcon />
        </Box>
        <Box>
          <Typography variant="h4">ثبت‌های من</Typography>
          <Typography color="text.secondary">تاریخچه فرم‌هایی که تاکنون ثبت کرده‌ای.</Typography>
        </Box>
      </Stack>

      {query.data?.content.map((submission) => (
        <Card key={submission.id} sx={{ transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
          <CardContent sx={{ p: 2.8 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <Typography variant="h6">{submission.formName}</Typography>
                <FormStatusChip status={submission.formStatus} />
              </Stack>
              <Typography variant="body2" color="text.secondary">زمان ثبت: {new Date(submission.submittedAt).toLocaleString('fa-IR')}</Typography>
              <Typography variant="caption" color="text.secondary">نسخه فرم: {submission.formVersion}</Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}

      {query.data?.content.length === 0 && <Alert severity="info">هنوز فرمی ثبت نکرده‌ای.</Alert>}
      {query.data && query.data.totalPages > 1 && <Pagination count={query.data.totalPages} page={page + 1} onChange={(_, value) => setPage(value - 1)} />}
    </Stack>
  );
}
