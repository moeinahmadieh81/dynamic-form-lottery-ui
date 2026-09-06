import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { FieldType } from '../../types/api';
import { FIELD_TYPE_LABELS } from './formBuilderTypes';

const FIELD_TYPES: FieldType[] = [
  'TEXT',
  'TEXTAREA',
  'NUMBER',
  'EMAIL',
  'PHONE',
  'DATE',
  'DATETIME',
  'SELECT',
  'MULTI_SELECT',
  'RADIO',
  'CHECKBOX',
  'BOOLEAN',
];

interface Props {
  onAdd: (type: FieldType) => void;
}

export function FormFieldToolbox({ onAdd }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="h6" fontWeight={800}>فیلدها</Typography>
            <Typography variant="body2" color="text.secondary">
              نوع فیلد را انتخاب کن و بعد تنظیماتش را تغییر بده.
            </Typography>
          </div>
          <Divider />
          <Stack spacing={1}>
            {FIELD_TYPES.map((type) => (
              <Button
                key={type}
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => onAdd(type)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {FIELD_TYPE_LABELS[type]}
              </Button>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
