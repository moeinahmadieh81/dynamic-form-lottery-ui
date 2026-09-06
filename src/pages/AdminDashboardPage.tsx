import AddIcon from '@mui/icons-material/Add';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { FormStatusChip } from '../components/FormStatusChip';
import { PageHero } from '../components/PageHero';
import { closeForm, listForms, publishForm } from '../features/forms/formsApi';
import { AdminLotteryActions } from '../features/lottery/AdminLotteryActions';

export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin-forms'], queryFn: () => listForms(0, 100) });
  const action = useMutation({
    mutationFn: ({ id, type }: { id: number; type: 'publish' | 'close' }) => type === 'publish' ? publishForm(id) : closeForm(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
      void queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });

  if (query.isError) return <Alert severity="error">{getApiErrorMessage(query.error)}</Alert>;
  const forms = query.data?.content ?? [];
  const draftCount = forms.filter((form) => form.status === 'DRAFT').length;
  const activeCount = forms.filter((form) => form.status === 'PUBLISHED').length;
  const drawnCount = forms.filter((form) => form.status === 'DRAWN').length;

  return (
    <Stack spacing={3.5}>
      <PageHero
        eyebrow="مرکز کنترل ادمین"
        title="همه‌چیز زیر کنترل توئه"
        subtitle="فرم جدید بساز، چرخه انتشار را مدیریت کن، پاسخ‌ها را ببین و قرعه‌کشی را از یک پنل واحد انجام بده."
        actions={(
          <Button
            component={RouterLink}
            to="/admin/forms/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: '#FFFFFF',
              color: '#4D4DC4',
              fontWeight: 900,
              border: '1px solid rgba(255,255,255,.92)',
              boxShadow: '0 12px 28px rgba(25,28,76,.22)',
              '& .MuiButton-startIcon': { color: '#4D4DC4' },
              '&:hover': {
                background: '#FFFFFF',
                color: '#3F3FAF',
                boxShadow: '0 16px 34px rgba(25,28,76,.28)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            ساخت فرم جدید
          </Button>
        )}
      />

      <Grid container spacing={2}>
        {[['کل فرم‌ها', forms.length, '#5B5BD6'], ['پیش‌نویس', draftCount, '#8B6AC8'], ['در حال پذیرش', activeCount, '#0F9D8A'], ['قرعه‌کشی‌شده', drawnCount, '#D8872D']].map(([label, value, color]) => (
          <Grid key={String(label)} size={{ xs: 6, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="h4" sx={{ mt: .4 }}>{value}</Typography>
                  </Box>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: alpha(String(color), .1), color: String(color) }}>
                    <AssignmentOutlinedIcon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {action.isError && <Alert severity="error">{getApiErrorMessage(action.error)}</Alert>}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">فرم‌های شما</Typography>
          <Typography variant="body2" color="text.secondary">مدیریت سریع فرم‌ها و وضعیت هر کدام</Typography>
        </Box>
        <Chip label={`${forms.length} فرم`} variant="outlined" />
      </Stack>

      <Grid container spacing={2.5}>
        {forms.map((form) => (
          <Grid key={form.id} size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 42px rgba(35,39,64,.10)', borderColor: alpha('#5B5BD6', .2) },
              }}
            >
              <CardContent sx={{ p: 2.7 }}>
                <Stack spacing={2.2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Box>
                      <Typography variant="h6">{form.name}</Typography>
                      <Typography color="text.secondary" sx={{ mt: .6, lineHeight: 1.8 }}>
                        {form.description || 'بدون توضیحات'}
                      </Typography>
                    </Box>
                    <FormStatusChip status={form.status} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">نسخه {form.currentVersion}</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="flex-end">
                      <Button component={RouterLink} to={`/admin/forms/${form.id}`} size="small" startIcon={<VisibilityOutlinedIcon />}>جزئیات</Button>
                      {form.status === 'DRAFT' && (
                        <>
                          <Button component={RouterLink} to={`/admin/forms/${form.id}/edit`} variant="outlined" size="small" startIcon={<EditOutlinedIcon />}>ویرایش</Button>
                          <Button variant="contained" size="small" onClick={() => action.mutate({ id: form.id, type: 'publish' })} disabled={action.isPending}>انتشار</Button>
                        </>
                      )}
                      {form.status === 'PUBLISHED' && (
                        <Button variant="outlined" size="small" color="warning" onClick={() => action.mutate({ id: form.id, type: 'close' })} disabled={action.isPending}>بستن فرم</Button>
                      )}
                    </Stack>
                  </Stack>
                  <AdminLotteryActions form={form} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
