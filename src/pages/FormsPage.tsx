import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { Alert, Box, Card, CardActionArea, CardContent, Grid, Pagination, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { FormStatusChip } from '../components/FormStatusChip';
import { PageHero } from '../components/PageHero';
import { listForms } from '../features/forms/formsApi';

export function FormsPage() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ['forms', page], queryFn: () => listForms(page, 12) });

  if (query.isError) return <Alert severity="error">{getApiErrorMessage(query.error)}</Alert>;

  return (
    <Stack spacing={3.5}>
      <PageHero
        eyebrow="فرم‌های فعال سامانه"
        title="فرم مناسب رو پیدا کن و شرکت کن"
        subtitle="فرم‌ها را ببین، اطلاعاتت را ثبت کن و بعد از پایان مهلت، نتیجه قرعه‌کشی را همین‌جا دنبال کن."
      />

      <Stack direction="row" justifyContent="space-between" alignItems="end" gap={2}>
        <Box>
          <Typography variant="h5">فرم‌ها</Typography>
          <Typography color="text.secondary" variant="body2">
            {query.data ? `${query.data.totalElements} فرم قابل مشاهده` : 'در حال دریافت فرم‌ها...'}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2.5}>
        {query.data?.content.map((form, index) => (
          <Grid key={form.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: '100%',
                overflow: 'hidden',
                transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 18px 46px rgba(35,39,64,.11)',
                  borderColor: alpha('#5B5BD6', .24),
                },
              }}
            >
              <CardActionArea sx={{ height: '100%' }} onClick={() => navigate(`/forms/${form.id}`)}>
                <Box
                  sx={{
                    height: 8,
                    background: index % 3 === 0
                      ? 'linear-gradient(90deg,#5B5BD6,#8383EE)'
                      : index % 3 === 1
                        ? 'linear-gradient(90deg,#0F9D8A,#48C2B0)'
                        : 'linear-gradient(90deg,#D8872D,#F1B45D)',
                  }}
                />
                <CardContent sx={{ p: 2.7 }}>
                  <Stack spacing={2.2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                      <Box
                        sx={{
                          width: 46, height: 46, borderRadius: 2.5, display: 'grid', placeItems: 'center',
                          color: 'primary.main', bgcolor: alpha('#5B5BD6', .08), flexShrink: 0,
                        }}
                      >
                        <AssignmentOutlinedIcon />
                      </Box>
                      <FormStatusChip status={form.status} />
                    </Stack>
                    <Box>
                      <Typography variant="h6" sx={{ mb: .7 }}>{form.name}</Typography>
                      <Typography color="text.secondary" sx={{ minHeight: 48, lineHeight: 1.85 }}>
                        {form.description || 'برای این فرم توضیحی ثبت نشده است.'}
                      </Typography>
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">نسخه {form.currentVersion}</Typography>
                      <Stack direction="row" alignItems="center" gap={.5} color="primary.main">
                        <Typography variant="body2" fontWeight={850}>مشاهده فرم</Typography>
                        <ChevronLeftRoundedIcon fontSize="small" />
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {query.data?.content.length === 0 && <Alert severity="info">فعلاً فرمی برای نمایش وجود ندارد.</Alert>}

      {query.data && query.data.totalPages > 1 && (
        <Pagination count={query.data.totalPages} page={page + 1} onChange={(_, value) => setPage(value - 1)} />
      )}
    </Stack>
  );
}
