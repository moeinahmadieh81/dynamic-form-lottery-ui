import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getApiErrorMessage } from '../../api/error';
import type { FormListItem } from '../../types/api';
import { createLottery, getAdminLotteryForForm, runLottery } from './lotteryApi';

interface Props {
  form: Pick<FormListItem, 'id' | 'status'>;
}

export function AdminLotteryActions({ form }: Props) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [winnerCount, setWinnerCount] = useState(1);

  const lotteryQuery = useQuery({
    queryKey: ['admin-form-lottery', form.id],
    queryFn: () => getAdminLotteryForForm(form.id),
    enabled: form.status === 'CLOSED' || form.status === 'DRAWN',
    retry: false,
  });

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-form-lottery', form.id] }),
      queryClient.invalidateQueries({ queryKey: ['admin-form-detail', form.id] }),
      queryClient.invalidateQueries({ queryKey: ['admin-forms'] }),
      queryClient.invalidateQueries({ queryKey: ['forms'] }),
      queryClient.invalidateQueries({ queryKey: ['lottery', form.id] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: () => createLottery(form.id, winnerCount),
    onSuccess: async () => {
      setDialogOpen(false);
      await refresh();
    },
  });

  const runMutation = useMutation({
    mutationFn: (lotteryId: number) => runLottery(lotteryId),
    onSuccess: refresh,
  });

  if (form.status !== 'CLOSED' && form.status !== 'DRAWN') {
    return null;
  }

  if (lotteryQuery.isLoading) {
    return <Typography variant="caption" color="text.secondary">در حال بررسی قرعه‌کشی...</Typography>;
  }

  if (lotteryQuery.isError) {
    return <Alert severity="error">{getApiErrorMessage(lotteryQuery.error)}</Alert>;
  }

  const lottery = lotteryQuery.data;
  const mutationError = createMutation.error ?? runMutation.error;

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {mutationError && <Alert severity="error">{getApiErrorMessage(mutationError)}</Alert>}

      {form.status === 'CLOSED' && !lottery && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<CasinoOutlinedIcon />}
          onClick={() => setDialogOpen(true)}
        >
          ایجاد قرعه‌کشی
        </Button>
      )}

      {lottery?.status === 'READY' && (
        <Stack spacing={1}>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip size="small" label={`شرکت‌کننده: ${lottery.participantCount}`} />
            <Chip size="small" label={`برنده: ${lottery.winnerCount}`} />
          </Stack>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<PlayArrowOutlinedIcon />}
            disabled={runMutation.isPending}
            onClick={() => runMutation.mutate(lottery.id)}
          >
            {runMutation.isPending ? 'در حال اجرای قرعه‌کشی...' : 'اجرای قرعه‌کشی'}
          </Button>
        </Stack>
      )}

      {lottery?.status === 'RUNNING' && (
        <Alert severity="info">قرعه‌کشی در حال اجرا است.</Alert>
      )}

      {(form.status === 'DRAWN' || lottery?.status === 'COMPLETED') && (
        <Button
          component={RouterLink}
          to={`/forms/${form.id}/lottery`}
          variant="outlined"
          color="success"
          size="small"
          startIcon={<EmojiEventsOutlinedIcon />}
        >
          مشاهده نتیجه قرعه‌کشی
        </Button>
      )}

      <Dialog open={dialogOpen} onClose={() => !createMutation.isPending && setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>ایجاد قرعه‌کشی</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              تعداد برندگان را مشخص کنید. شرکت‌کنندگان در همین لحظه Snapshot می‌شوند.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              type="number"
              label="تعداد برندگان"
              value={winnerCount}
              slotProps={{ htmlInput: { min: 1 } }}
              onChange={(event) => {
                const value = Number(event.target.value);
                setWinnerCount(Number.isFinite(value) ? Math.max(1, Math.trunc(value)) : 1);
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={createMutation.isPending}>انصراف</Button>
          <Button
            variant="contained"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || winnerCount < 1}
          >
            {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
