import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { BuilderField } from './formBuilderTypes';
import { FIELD_TYPE_LABELS } from './formBuilderTypes';

interface Props {
  field: BuilderField;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function SortableFieldCard({ field, selected, onSelect, onDuplicate, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.builderId,
  });

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        borderColor: selected ? 'primary.main' : undefined,
        borderWidth: selected ? 2 : 1,
      }}
    >
      <Stack direction="row" alignItems="stretch">
        <Box
          {...attributes}
          {...listeners}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1,
            cursor: 'grab',
            color: 'text.secondary',
            bgcolor: 'action.hover',
          }}
          aria-label="جابجایی فیلد"
        >
          <DragIndicatorIcon />
        </Box>

        <CardActionArea onClick={onSelect} sx={{ p: 2, flex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ sm: 'center' }}>
            <Stack sx={{ flex: 1 }}>
              <Typography fontWeight={800}>{field.label || 'بدون عنوان'}</Typography>
              <Typography variant="caption" color="text.secondary" dir="ltr" textAlign="right">
                {field.key || 'no_key'}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip size="small" label={FIELD_TYPE_LABELS[field.type]} />
              {field.required && <Chip size="small" color="primary" label="الزامی" />}
            </Stack>
          </Stack>
        </CardActionArea>

        <Stack direction="row" alignItems="center" px={1}>
          <Tooltip title="تنظیمات">
            <IconButton onClick={onSelect}><SettingsOutlinedIcon /></IconButton>
          </Tooltip>
          <Tooltip title="کپی فیلد">
            <IconButton onClick={onDuplicate}><ContentCopyIcon /></IconButton>
          </Tooltip>
          <Tooltip title="حذف">
            <IconButton color="error" onClick={onDelete}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
