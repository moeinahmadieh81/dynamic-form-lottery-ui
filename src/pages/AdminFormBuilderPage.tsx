import { Alert, Button, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { BackButton } from '../components/BackButton';
import { FormBuilder } from '../features/form-builder/FormBuilder';
import { createForm, getForm, updateDraftForm, type SaveFormRequest } from '../features/forms/formsApi';

export function AdminFormBuilderPage() {
  const { id } = useParams();
  const formId = id ? Number(id) : null;
  const editing = formId !== null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formQuery = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getForm(formId as number),
    enabled: editing && Number.isFinite(formId),
  });

  const mutation = useMutation({
    mutationFn: (payload: SaveFormRequest) =>
      editing ? updateDraftForm(formId as number, payload) : createForm(payload),
    onSuccess: async (form) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-forms'] }),
        queryClient.invalidateQueries({ queryKey: ['forms'] }),
        queryClient.invalidateQueries({ queryKey: ['form', form.id] }),
      ]);
      navigate(`/admin/forms/${form.id}/edit`, { replace: true });
    },
  });

  if (editing && formQuery.isLoading) return <Typography>در حال دریافت فرم...</Typography>;
  if (editing && formQuery.isError) return <Alert severity="error">{getApiErrorMessage(formQuery.error)}</Alert>;

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h4" fontWeight={900}>
            {editing ? 'ویرایش فرم' : 'ساخت فرم جدید'}
          </Typography>
          <Typography color="text.secondary">
            فیلدها را بساز، مرتب کن، اعتبارسنجی را تنظیم کن و نتیجه را پیش‌نمایش بگیر.
          </Typography>
        </div>
        <BackButton to="/admin" label="بازگشت به مدیریت" />
      </Stack>

      <FormBuilder
        key={formQuery.data?.currentVersion ?? 'new'}
        initialForm={formQuery.data}
        saving={mutation.isPending}
        apiError={mutation.isError ? getApiErrorMessage(mutation.error) : null}
        onSave={(payload) => mutation.mutateAsync(payload)}
      />
    </Stack>
  );
}
