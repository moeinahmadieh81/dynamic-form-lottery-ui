import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Pagination,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { BackButton } from '../components/BackButton';
import { FormStatusChip } from '../components/FormStatusChip';
import { closeForm, getForm, publishForm } from '../features/forms/formsApi';
import { AdminLotteryActions } from '../features/lottery/AdminLotteryActions';
import { getAdminLotteryForForm, getAdminLotteryWinners } from '../features/lottery/lotteryApi';
import { listAdminSubmissions } from '../features/submissions/submissionsApi';
import type { AdminSubmission, FieldDefinition } from '../types/api';

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function answerLabel(field: FieldDefinition, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';

  if (field.type === 'BOOLEAN') {
    return value === true ? 'بله' : 'خیر';
  }

  const optionLabel = (rawValue: unknown) => {
    const raw = String(rawValue);
    return field.options.find((option) => option.value === raw)?.label ?? raw;
  };

  if (Array.isArray(value)) {
    return value.length ? value.map(optionLabel).join('، ') : '—';
  }

  if (['SELECT', 'RADIO', 'MULTI_SELECT', 'CHECKBOX'].includes(field.type)) {
    return optionLabel(value);
  }

  return String(value);
}

function submissionStatusLabel(status: AdminSubmission['status']) {
  if (status === 'SUBMITTED') return 'ثبت‌شده';
  if (status === 'DISQUALIFIED') return 'رد صلاحیت';
  return 'لغوشده';
}

interface AnswersDialogProps {
  submission: AdminSubmission | null;
  fields: FieldDefinition[];
  onClose: () => void;
}

function AnswersDialog({ submission, fields, onClose }: AnswersDialogProps) {
  return (
    <Dialog open={Boolean(submission)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>پاسخ‌های ثبت‌شده</DialogTitle>
      <DialogContent>
        {submission && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} flexWrap="wrap">
              <Chip size="small" label={`Submission #${submission.id}`} />
              <Chip size="small" label={`نسخه فرم ${submission.formVersion}`} />
              <Chip size="small" label={submissionStatusLabel(submission.status)} />
            </Stack>

            <Divider />

            {fields.map((field) => (
              <Box key={field.key}>
                <Typography variant="caption" color="text.secondary">
                  {field.label}
                </Typography>
                <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {answerLabel(field, submission.answers[field.key])}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}

export function AdminFormDetailsPage() {
  const { id } = useParams();
  const formId = Number(id);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [submissionPage, setSubmissionPage] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null);

  const formQuery = useQuery({
    queryKey: ['admin-form-detail', formId],
    queryFn: () => getForm(formId),
    enabled: Number.isFinite(formId),
  });

  const submissionsQuery = useQuery({
    queryKey: ['admin-form-submissions', formId, submissionPage],
    queryFn: () => listAdminSubmissions(formId, submissionPage, 10),
    enabled: Number.isFinite(formId),
  });

  const lotteryQuery = useQuery({
    queryKey: ['admin-form-lottery', formId],
    queryFn: () => getAdminLotteryForForm(formId),
    enabled: Number.isFinite(formId) && (formQuery.data?.status === 'CLOSED' || formQuery.data?.status === 'DRAWN'),
    retry: false,
  });

  const winnersQuery = useQuery({
    queryKey: ['admin-lottery-winners', lotteryQuery.data?.id],
    queryFn: () => getAdminLotteryWinners(lotteryQuery.data!.id),
    enabled: lotteryQuery.data?.status === 'COMPLETED' && Boolean(lotteryQuery.data?.id),
  });

  const lifecycleMutation = useMutation({
    mutationFn: ({ type }: { type: 'publish' | 'close' }) =>
      type === 'publish' ? publishForm(formId) : closeForm(formId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-form-detail', formId] }),
        queryClient.invalidateQueries({ queryKey: ['admin-forms'] }),
        queryClient.invalidateQueries({ queryKey: ['forms'] }),
      ]);
    },
  });

  const orderedFields = useMemo(
    () => [...(formQuery.data?.schema.fields ?? [])].sort((a, b) => a.order - b.order),
    [formQuery.data?.schema.fields],
  );

  if (!Number.isFinite(formId)) {
    return <Alert severity="error">شناسه فرم معتبر نیست.</Alert>;
  }

  if (formQuery.isLoading) {
    return <Typography color="text.secondary">در حال دریافت اطلاعات فرم...</Typography>;
  }

  if (formQuery.isError || !formQuery.data) {
    return <Alert severity="error">{getApiErrorMessage(formQuery.error)}</Alert>;
  }

  const form = formQuery.data;
  const submissions = submissionsQuery.data;
  const lottery = lotteryQuery.data;
  const requiredCount = orderedFields.filter((field) => field.required).length;

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
        <Stack spacing={0.75}>
          <BackButton to="/admin" label="بازگشت به پنل مدیریت" />
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            <Typography variant="h4" fontWeight={900}>{form.name}</Typography>
            <FormStatusChip status={form.status} />
          </Stack>
          <Typography color="text.secondary">{form.description || 'بدون توضیحات'}</Typography>
        </Stack>

        <Stack direction="row" gap={1} alignItems="flex-start" flexWrap="wrap">
          <Button
            component={RouterLink}
            to={`/forms/${form.id}`}
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
          >
            نمای کاربر
          </Button>
          {form.status === 'DRAFT' && (
            <>
              <Button
                component={RouterLink}
                to={`/admin/forms/${form.id}/edit`}
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
              >
                ویرایش
              </Button>
              <Button
                variant="contained"
                disabled={lifecycleMutation.isPending}
                onClick={() => lifecycleMutation.mutate({ type: 'publish' })}
              >
                انتشار
              </Button>
            </>
          )}
          {form.status === 'PUBLISHED' && (
            <Button
              variant="outlined"
              color="warning"
              disabled={lifecycleMutation.isPending}
              onClick={() => lifecycleMutation.mutate({ type: 'close' })}
            >
              بستن فرم
            </Button>
          )}
        </Stack>
      </Stack>

      {lifecycleMutation.isError && (
        <Alert severity="error">{getApiErrorMessage(lifecycleMutation.error)}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined"><CardContent>
            <Typography color="text.secondary" variant="body2">نسخه فعلی</Typography>
            <Typography variant="h5" fontWeight={900}>{form.currentVersion}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined"><CardContent>
            <Typography color="text.secondary" variant="body2">تعداد فیلدها</Typography>
            <Typography variant="h5" fontWeight={900}>{orderedFields.length}</Typography>
            <Typography variant="caption" color="text.secondary">{requiredCount} فیلد الزامی</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined"><CardContent>
            <Typography color="text.secondary" variant="body2">Submissionها</Typography>
            <Typography variant="h5" fontWeight={900}>{submissions?.totalElements ?? '—'}</Typography>
            <Typography variant="caption" color="text.secondary">کل ثبت‌های این فرم</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined"><CardContent>
            <Typography color="text.secondary" variant="body2">قرعه‌کشی</Typography>
            <Typography variant="h5" fontWeight={900}>
              {lottery ? lottery.status : form.status === 'CLOSED' ? 'ایجاد نشده' : '—'}
            </Typography>
            {lottery && (
              <Typography variant="caption" color="text.secondary">
                {lottery.participantCount} شرکت‌کننده / {lottery.winnerCount} برنده
              </Typography>
            )}
          </CardContent></Card>
        </Grid>
      </Grid>

      <Paper variant="outlined">
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab label="اطلاعات فرم" />
          <Tab label={`شرکت‌کنندگان (${submissions?.totalElements ?? 0})`} />
          <Tab label="قرعه‌کشی و برندگان" />
        </Tabs>
        <Divider />

        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={800}>تنظیمات فرم</Typography>
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography color="text.secondary">شروع دریافت پاسخ</Typography>
                    <Typography>{formatDate(form.startAt)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography color="text.secondary">پایان دریافت پاسخ</Typography>
                    <Typography>{formatDate(form.endAt)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography color="text.secondary">نسخه Schema</Typography>
                    <Typography>{form.currentVersion}</Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>فیلدهای فرم</Typography>
                  {orderedFields.map((field) => (
                    <Card key={field.key} variant="outlined">
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                          <div>
                            <Typography fontWeight={700}>{field.label}</Typography>
                            <Typography variant="caption" color="text.secondary" dir="ltr">
                              {field.key}
                            </Typography>
                          </div>
                          <Stack direction="row" gap={1}>
                            <Chip size="small" label={field.type} />
                            {field.required && <Chip size="small" color="primary" label="الزامی" />}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <PeopleAltOutlinedIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>شرکت‌کنندگان و پاسخ‌ها</Typography>
              </Stack>

              {submissionsQuery.isError && (
                <Alert severity="error">{getApiErrorMessage(submissionsQuery.error)}</Alert>
              )}

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>کاربر</TableCell>
                      <TableCell>ایمیل</TableCell>
                      <TableCell>وضعیت</TableCell>
                      <TableCell>نسخه فرم</TableCell>
                      <TableCell>زمان ثبت</TableCell>
                      <TableCell align="center">پاسخ‌ها</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissionsQuery.isLoading && (
                      <TableRow><TableCell colSpan={6}>در حال دریافت...</TableCell></TableRow>
                    )}
                    {!submissionsQuery.isLoading && submissions?.content.length === 0 && (
                      <TableRow><TableCell colSpan={6}>هنوز پاسخی ثبت نشده است.</TableCell></TableRow>
                    )}
                    {submissions?.content.map((submission) => (
                      <TableRow key={submission.id} hover>
                        <TableCell>{submission.user?.displayName ?? 'کاربر قدیمی / ناشناس'}</TableCell>
                        <TableCell dir="ltr">{submission.user?.email ?? '—'}</TableCell>
                        <TableCell><Chip size="small" label={submissionStatusLabel(submission.status)} /></TableCell>
                        <TableCell>{submission.formVersion}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell align="center">
                          <Button size="small" onClick={() => setSelectedSubmission(submission)}>مشاهده</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {(submissions?.totalPages ?? 0) > 1 && (
                <Pagination
                  count={submissions?.totalPages ?? 1}
                  page={submissionPage + 1}
                  onChange={(_, page) => setSubmissionPage(page - 1)}
                  sx={{ alignSelf: 'center' }}
                />
              )}
            </Stack>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" gap={1}>
                <EmojiEventsOutlinedIcon color="warning" />
                <Typography variant="h6" fontWeight={800}>قرعه‌کشی و برندگان</Typography>
              </Stack>

              {form.status !== 'CLOSED' && form.status !== 'DRAWN' && (
                <Alert severity="info">برای ساخت قرعه‌کشی ابتدا فرم باید بسته شود.</Alert>
              )}

              <AdminLotteryActions form={{ id: form.id, status: form.status }} />

              {lotteryQuery.isError && (
                <Alert severity="error">{getApiErrorMessage(lotteryQuery.error)}</Alert>
              )}

              {lottery && (
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">وضعیت</Typography>
                        <Typography fontWeight={800}>{lottery.status}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">شرکت‌کنندگان Snapshot</Typography>
                        <Typography fontWeight={800}>{lottery.participantCount}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">تعداد برندگان</Typography>
                        <Typography fontWeight={800}>{lottery.winnerCount}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">زمان اتمام</Typography>
                        <Typography>{formatDate(lottery.completedAt)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {lottery?.status === 'COMPLETED' && (
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={800}>برندگان</Typography>
                  {winnersQuery.isError && (
                    <Alert severity="error">{getApiErrorMessage(winnersQuery.error)}</Alert>
                  )}
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>رتبه</TableCell>
                          <TableCell>نام</TableCell>
                          <TableCell>ایمیل</TableCell>
                          <TableCell>Submission</TableCell>
                          <TableCell>زمان انتخاب</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {winnersQuery.isLoading && (
                          <TableRow><TableCell colSpan={5}>در حال دریافت برندگان...</TableCell></TableRow>
                        )}
                        {winnersQuery.data?.map((winner) => (
                          <TableRow key={`${winner.position}-${winner.userId}`}>
                            <TableCell>
                              <Chip color="warning" size="small" label={`#${winner.position}`} />
                            </TableCell>
                            <TableCell>{winner.displayName}</TableCell>
                            <TableCell dir="ltr">{winner.email}</TableCell>
                            <TableCell>#{winner.submissionId}</TableCell>
                            <TableCell>{formatDate(winner.selectedAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      <AnswersDialog
        submission={selectedSubmission}
        fields={orderedFields}
        onClose={() => setSelectedSubmission(null)}
      />
    </Stack>
  );
}
