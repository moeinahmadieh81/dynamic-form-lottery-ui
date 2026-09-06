import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import type { FormStatus } from '../types/api';

const labels: Record<FormStatus, string> = {
  DRAFT: 'پیش‌نویس',
  PUBLISHED: 'منتشرشده',
  CLOSED: 'بسته',
  DRAWN: 'قرعه‌کشی‌شده',
  ARCHIVED: 'آرشیو',
};

const colors: Record<FormStatus, ChipProps['color']> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  CLOSED: 'warning',
  DRAWN: 'primary',
  ARCHIVED: 'default',
};

export function FormStatusChip({ status }: { status: FormStatus }) {
  return <Chip size="small" color={colors[status]} label={labels[status]} variant={status === 'DRAFT' || status === 'ARCHIVED' ? 'outlined' : 'filled'} />;
}
