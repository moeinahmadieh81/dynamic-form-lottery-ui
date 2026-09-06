import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { FieldOption, FieldType, FieldValidation } from '../../types/api';
import type { BuilderField } from './formBuilderTypes';
import {
  FIELD_TYPE_LABELS,
  OPTION_FIELD_TYPES,
  TEXT_VALIDATION_FIELD_TYPES,
} from './formBuilderTypes';

interface Props {
  field?: BuilderField;
  keyError?: string | null;
  onChange: (field: BuilderField) => void;
}

const ALL_FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as FieldType[];

function numberOrUndefined(value: string): number | undefined {
  return value === '' ? undefined : Number(value);
}

export function FieldSettingsPanel({ field, keyError, onChange }: Props) {
  if (!field) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" fontWeight={800}>تنظیمات فیلد</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            یک فیلد را از فرم انتخاب کن تا تنظیمات آن نمایش داده شود.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const update = <K extends keyof BuilderField>(key: K, value: BuilderField[K]) => {
    onChange({ ...field, [key]: value });
  };

  const updateValidation = (next: Partial<FieldValidation>) => {
    const validation = { ...(field.validation ?? {}), ...next };
    const hasAny = Object.values(validation).some((value) => value !== undefined && value !== '');
    update('validation', hasAny ? validation : null);
  };

  const typeHasOptions = OPTION_FIELD_TYPES.includes(field.type);
  const typeHasTextValidation = TEXT_VALIDATION_FIELD_TYPES.includes(field.type);
  const typeHasNumberValidation = field.type === 'NUMBER';

  const changeType = (type: FieldType) => {
    const options = OPTION_FIELD_TYPES.includes(type)
      ? (field.options.length > 0 ? field.options : [{ value: 'option1', label: 'گزینه ۱' }])
      : [];

    onChange({
      ...field,
      type,
      options,
      validation: type === 'NUMBER' || TEXT_VALIDATION_FIELD_TYPES.includes(type)
        ? field.validation
        : null,
    });
  };

  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    const options = field.options.map((option, optionIndex) =>
      optionIndex === index ? { ...option, [key]: value } : option,
    );
    update('options', options);
  };

  const addOption = () => {
    const index = field.options.length + 1;
    update('options', [...field.options, { value: `option${index}`, label: `گزینه ${index}` }]);
  };

  const removeOption = (index: number) => {
    update('options', field.options.filter((_, optionIndex) => optionIndex !== index));
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2.5}>
          <div>
            <Typography variant="h6" fontWeight={800}>تنظیمات فیلد</Typography>
            <Typography variant="body2" color="text.secondary">
              شناسه فیلد بعد از دریافت Submissionها بهتر است تغییر نکند.
            </Typography>
          </div>
          <Divider />

          <TextField
            label="عنوان فیلد"
            value={field.label}
            onChange={(event) => update('label', event.target.value)}
            fullWidth
            required
          />

          <TextField
            label="کلید فیلد"
            value={field.key}
            onChange={(event) => update('key', event.target.value)}
            fullWidth
            required
            error={Boolean(keyError)}
            helperText={keyError || 'مثال: fullName — فقط حروف انگلیسی، عدد و _'}
            slotProps={{ htmlInput: { dir: 'ltr' } }}
          />

          <TextField
            select
            label="نوع فیلد"
            value={field.type}
            onChange={(event) => changeType(event.target.value as FieldType)}
            fullWidth
          >
            {ALL_FIELD_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{FIELD_TYPE_LABELS[type]}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            label="پاسخ به این فیلد الزامی باشد"
            control={(
              <Checkbox
                checked={field.required}
                onChange={(_, checked) => update('required', checked)}
              />
            )}
          />

          {typeHasTextValidation && (
            <>
              <Divider>اعتبارسنجی متن</Divider>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="حداقل طول"
                  type="number"
                  value={field.validation?.minLength ?? ''}
                  onChange={(event) =>
                    updateValidation({ minLength: numberOrUndefined(event.target.value) })}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <TextField
                  label="حداکثر طول"
                  type="number"
                  value={field.validation?.maxLength ?? ''}
                  onChange={(event) =>
                    updateValidation({ maxLength: numberOrUndefined(event.target.value) })}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Stack>
              <TextField
                label="Regex Pattern"
                value={field.validation?.pattern ?? ''}
                onChange={(event) => updateValidation({ pattern: event.target.value || undefined })}
                fullWidth
                slotProps={{ htmlInput: { dir: 'ltr' } }}
                placeholder="^09\\d{9}$"
              />
            </>
          )}

          {typeHasNumberValidation && (
            <>
              <Divider>اعتبارسنجی عدد</Divider>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="حداقل مقدار"
                  type="number"
                  value={field.validation?.min ?? ''}
                  onChange={(event) => updateValidation({ min: numberOrUndefined(event.target.value) })}
                  fullWidth
                />
                <TextField
                  label="حداکثر مقدار"
                  type="number"
                  value={field.validation?.max ?? ''}
                  onChange={(event) => updateValidation({ max: numberOrUndefined(event.target.value) })}
                  fullWidth
                />
              </Stack>
            </>
          )}

          {typeHasOptions && (
            <>
              <Divider>گزینه‌ها</Divider>
              {field.options.length === 0 && (
                <Alert severity="warning">این نوع فیلد باید حداقل یک گزینه داشته باشد.</Alert>
              )}
              <Stack spacing={1.5}>
                {field.options.map((option, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      label="عنوان"
                      size="small"
                      value={option.label}
                      onChange={(event) => updateOption(index, 'label', event.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="value"
                      size="small"
                      value={option.value}
                      onChange={(event) => updateOption(index, 'value', event.target.value)}
                      fullWidth
                      slotProps={{ htmlInput: { dir: 'ltr' } }}
                    />
                    <IconButton color="error" onClick={() => removeOption(index)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button startIcon={<AddIcon />} onClick={addOption} sx={{ alignSelf: 'flex-start' }}>
                  افزودن گزینه
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
