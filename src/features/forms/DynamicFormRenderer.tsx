import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { FieldDefinition, FormSchema } from '../../types/api';

interface Props {
  schema: FormSchema;
  disabled?: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (answers: Record<string, unknown>) => Promise<void> | void;
}

type FormValues = Record<string, any>;

function defaultValueFor(field: FieldDefinition) {
  if (field.type === 'BOOLEAN') return false;
  if (field.type === 'MULTI_SELECT' || field.type === 'CHECKBOX') return [];
  return '';
}

function rulesFor(field: FieldDefinition) {
  const validation = field.validation;
  const arrayField = field.type === 'MULTI_SELECT' || field.type === 'CHECKBOX';
  const booleanField = field.type === 'BOOLEAN';

  return {
    required: field.required && !arrayField && !booleanField ? `${field.label} الزامی است` : false,
    validate: field.required && arrayField
      ? (value: unknown) => (Array.isArray(value) && value.length > 0) || `${field.label} الزامی است`
      : field.required && booleanField
        ? (value: unknown) => typeof value === 'boolean' || `${field.label} الزامی است`
        : undefined,
    minLength: validation?.minLength
      ? { value: validation.minLength, message: `حداقل ${validation.minLength} کاراکتر` }
      : undefined,
    maxLength: validation?.maxLength
      ? { value: validation.maxLength, message: `حداکثر ${validation.maxLength} کاراکتر` }
      : undefined,
    min: validation?.min !== undefined
      ? { value: validation.min, message: `حداقل مقدار ${validation.min}` }
      : undefined,
    max: validation?.max !== undefined
      ? { value: validation.max, message: `حداکثر مقدار ${validation.max}` }
      : undefined,
    pattern: validation?.pattern
      ? { value: new RegExp(validation.pattern), message: 'فرمت مقدار معتبر نیست' }
      : undefined,
  };
}

export function DynamicFormRenderer({ schema, disabled, submitting, error, onSubmit }: Props) {
  const orderedFields = [...schema.fields].sort((a, b) => a.order - b.order);
  const defaultValues = Object.fromEntries(orderedFields.map((field) => [field.key, defaultValueFor(field)]));
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues });

  const submit = handleSubmit(async (values) => {
    const normalized = Object.fromEntries(
      orderedFields.map((field) => {
        const value = values[field.key];
        if (field.type === 'NUMBER' && value !== '' && value !== null && value !== undefined) {
          return [field.key, Number(value)];
        }
        if (field.type === 'DATETIME' && value) {
          return [field.key, new Date(value).toISOString()];
        }
        return [field.key, value];
      }),
    );
    await onSubmit(normalized);
  });

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit}>
      {error && <Alert severity="error">{error}</Alert>}

      {orderedFields.map((field) => (
        <Controller
          key={field.key}
          name={field.key}
          control={control}
          rules={rulesFor(field)}
          render={({ field: input, fieldState }) => {
            const commonError = Boolean(fieldState.error);
            const helperText = fieldState.error?.message;

            if (field.type === 'TEXT' || field.type === 'EMAIL' || field.type === 'PHONE') {
              return (
                <TextField
                  {...input}
                  label={field.label}
                  required={field.required}
                  type={field.type === 'EMAIL' ? 'email' : 'text'}
                  disabled={disabled}
                  error={commonError}
                  helperText={helperText}
                  fullWidth
                />
              );
            }

            if (field.type === 'TEXTAREA') {
              return (
                <TextField
                  {...input}
                  label={field.label}
                  required={field.required}
                  multiline
                  minRows={4}
                  disabled={disabled}
                  error={commonError}
                  helperText={helperText}
                  fullWidth
                />
              );
            }

            if (field.type === 'NUMBER') {
              return (
                <TextField
                  {...input}
                  label={field.label}
                  required={field.required}
                  type="number"
                  disabled={disabled}
                  error={commonError}
                  helperText={helperText}
                  fullWidth
                  slotProps={{ htmlInput: { min: field.validation?.min, max: field.validation?.max } }}
                />
              );
            }

            if (field.type === 'DATE' || field.type === 'DATETIME') {
              return (
                <TextField
                  {...input}
                  label={field.label}
                  required={field.required}
                  type={field.type === 'DATE' ? 'date' : 'datetime-local'}
                  disabled={disabled}
                  error={commonError}
                  helperText={helperText}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              );
            }

            if (field.type === 'SELECT' || field.type === 'MULTI_SELECT') {
              const multiple = field.type === 'MULTI_SELECT';
              return (
                <FormControl fullWidth required={field.required} error={commonError} disabled={disabled}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    {...input}
                    multiple={multiple}
                    label={field.label}
                    value={multiple ? (input.value ?? []) : (input.value ?? '')}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                  {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>
              );
            }

            if (field.type === 'RADIO') {
              return (
                <FormControl required={field.required} error={commonError} disabled={disabled}>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup {...input}>
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                  {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>
              );
            }

            if (field.type === 'CHECKBOX') {
              const selected: string[] = input.value ?? [];
              return (
                <FormControl required={field.required} error={commonError} disabled={disabled}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormGroup>
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        label={option.label}
                        control={
                          <Checkbox
                            checked={selected.includes(option.value)}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...selected, option.value]
                                : selected.filter((value) => value !== option.value);
                              input.onChange(next);
                            }}
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                  {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>
              );
            }

            if (field.type === 'BOOLEAN') {
              return (
                <FormControl error={commonError} disabled={disabled}>
                  <FormControlLabel
                    label={field.label}
                    control={
                      <Checkbox
                        checked={Boolean(input.value)}
                        onChange={(_, checked) => input.onChange(checked)}
                      />
                    }
                  />
                  {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>
              );
            }

            return <Alert severity="warning">نوع فیلد {field.type} در UI پشتیبانی نشده است.</Alert>;
          }}
        />
      ))}

      {!disabled && (
        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? 'در حال ثبت...' : 'ثبت فرم'}
        </Button>
      )}
    </Stack>
  );
}
