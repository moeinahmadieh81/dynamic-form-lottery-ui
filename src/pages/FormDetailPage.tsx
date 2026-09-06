import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import { Alert, Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { useAuth } from '../auth/AuthContext';
import { BackButton } from '../components/BackButton';
import { FormStatusChip } from '../components/FormStatusChip';
import { DynamicFormRenderer } from '../features/forms/DynamicFormRenderer';
import { getForm } from '../features/forms/formsApi';
import { submitForm } from '../features/submissions/submissionsApi';

export function FormDetailPage() {
  const { id } = useParams();
  const formId = Number(id);
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const formQuery = useQuery({ queryKey: ['form', formId], queryFn: () => getForm(formId), enabled: Number.isFinite(formId) });
  const mutation = useMutation({
    mutationFn: (answers: Record<string, unknown>) => submitForm(formId, answers),
    onSuccess: () => { setSuccess(true); setSubmissionError(null); },
    onError: (error) => setSubmissionError(getApiErrorMessage(error)),
  });

  if (formQuery.isLoading) return <Typography color="text.secondary">در حال دریافت فرم...</Typography>;
  if (formQuery.isError) return <Alert severity="error">{getApiErrorMessage(formQuery.error)}</Alert>;
  if (!formQuery.data) return null;

  const form = formQuery.data;
  const canSubmit = user?.role === 'USER' && form.status === 'PUBLISHED';

  return (
    <Stack spacing={3}>
      <BackButton to="/forms" label="بازگشت به فرم‌ها" />

      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2.5, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(91,91,214,.08) 0%, rgba(15,157,138,.06) 100%)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} gap={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <Box sx={{ width: 58, height: 58, borderRadius: 3, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: alpha('#5B5BD6', .1) }}>
              <AssignmentTurnedInRoundedIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="h4">{form.name}</Typography>
              {form.description && <Typography color="text.secondary" sx={{ mt: .6 }}>{form.description}</Typography>}
            </Box>
          </Stack>
          <Stack alignItems={{ md: 'flex-end' }} gap={1}>
            <FormStatusChip status={form.status} />
            <Typography variant="caption" color="text.secondary">نسخه {form.currentVersion}</Typography>
          </Stack>
        </Stack>
      </Box>

      {success && <Alert severity="success">فرم با موفقیت ثبت شد. ممنون از مشارکتت 🌱</Alert>}
      {form.status === 'CLOSED' && <Alert severity="info">مهلت ثبت این فرم به پایان رسیده است.</Alert>}
      {form.status === 'DRAWN' && (
        <Alert severity="info" action={<Button component={RouterLink} to={`/forms/${form.id}/lottery`}>مشاهده نتیجه</Button>}>
          قرعه‌کشی این فرم انجام شده است.
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6">اطلاعات فرم</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>فیلدها را با دقت تکمیل کن.</Typography>
            </Box>
            <Divider />
            <DynamicFormRenderer
              schema={form.schema}
              disabled={!canSubmit || success}
              submitting={mutation.isPending}
              error={submissionError}
              onSubmit={async (answers) => mutation.mutateAsync(answers)}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
