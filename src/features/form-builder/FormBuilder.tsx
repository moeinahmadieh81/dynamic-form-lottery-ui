import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { FieldType, FormDetail } from '../../types/api';
import { DynamicFormRenderer } from '../forms/DynamicFormRenderer';
import { FieldSettingsPanel } from './FieldSettingsPanel';
import { FormFieldToolbox } from './FormFieldToolbox';
import type { BuilderField, FormDraftValues } from './formBuilderTypes';
import {
  builderFieldsToSchema,
  FIELD_TYPE_LABELS,
  formSchemaToBuilderFields,
  requiresOptions,
} from './formBuilderTypes';
import { SortableFieldCard } from './SortableFieldCard';

interface SavePayload {
  name: string;
  description: string | null;
  startAt: string | null;
  endAt: string | null;
  schema: ReturnType<typeof builderFieldsToSchema>;
}

interface Props {
  initialForm?: FormDetail;
  saving?: boolean;
  apiError?: string | null;
  onSave: (payload: SavePayload) => Promise<void> | void;
}

function isoToLocalInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function localInputToIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function createField(type: FieldType, existingFields: BuilderField[]): BuilderField {
  const typePrefix: Record<FieldType, string> = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    EMAIL: 'email',
    PHONE: 'phone',
    DATE: 'date',
    DATETIME: 'datetime',
    SELECT: 'select',
    MULTI_SELECT: 'multiSelect',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    BOOLEAN: 'boolean',
  };

  const usedKeys = new Set(existingFields.map((field) => field.key));
  let suffix = existingFields.length + 1;
  let key = `${typePrefix[type]}${suffix}`;
  while (usedKeys.has(key)) {
    suffix += 1;
    key = `${typePrefix[type]}${suffix}`;
  }

  return {
    builderId: crypto.randomUUID(),
    key,
    type,
    label: FIELD_TYPE_LABELS[type],
    required: false,
    order: existingFields.length + 1,
    validation: null,
    options: requiresOptions(type) ? [{ value: 'option1', label: 'گزینه ۱' }] : [],
  };
}

function normalizeOrders(fields: BuilderField[]) {
  return fields.map((field, index) => ({ ...field, order: index + 1 }));
}

function validateDraft(values: FormDraftValues): string[] {
  const errors: string[] = [];
  if (!values.name.trim()) errors.push('نام فرم الزامی است.');
  if (values.startAt && values.endAt && new Date(values.endAt) <= new Date(values.startAt)) {
    errors.push('زمان پایان باید بعد از زمان شروع باشد.');
  }

  const keys = new Set<string>();
  values.fields.forEach((field, index) => {
    const position = index + 1;
    if (!field.label.trim()) errors.push(`عنوان فیلد شماره ${position} خالی است.`);
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key)) {
      errors.push(`کلید «${field.key || `فیلد ${position}`}» معتبر نیست.`);
    }
    if (keys.has(field.key)) errors.push(`کلید «${field.key}» تکراری است.`);
    keys.add(field.key);

    if (requiresOptions(field.type)) {
      if (field.options.length === 0) errors.push(`فیلد «${field.label}» حداقل یک گزینه لازم دارد.`);
      const optionValues = new Set<string>();
      field.options.forEach((option) => {
        if (!option.label.trim() || !option.value.trim()) {
          errors.push(`همه گزینه‌های فیلد «${field.label}» باید عنوان و value داشته باشند.`);
        }
        if (optionValues.has(option.value)) {
          errors.push(`value گزینه «${option.value}» در فیلد «${field.label}» تکراری است.`);
        }
        optionValues.add(option.value);
      });
    }

    const validation = field.validation;
    if (validation?.minLength !== undefined && validation?.maxLength !== undefined
      && validation.minLength > validation.maxLength) {
      errors.push(`حداقل طول فیلد «${field.label}» از حداکثر طول بیشتر است.`);
    }
    if (validation?.min !== undefined && validation?.max !== undefined && validation.min > validation.max) {
      errors.push(`حداقل مقدار فیلد «${field.label}» از حداکثر مقدار بیشتر است.`);
    }
    if (validation?.pattern) {
      try {
        new RegExp(validation.pattern);
      } catch {
        errors.push(`Regex فیلد «${field.label}» معتبر نیست.`);
      }
    }
  });
  return [...new Set(errors)];
}

export function FormBuilder({ initialForm, saving, apiError, onSave }: Props) {
  const [values, setValues] = useState<FormDraftValues>(() => ({
    name: initialForm?.name ?? '',
    description: initialForm?.description ?? '',
    startAt: isoToLocalInput(initialForm?.startAt),
    endAt: isoToLocalInput(initialForm?.endAt),
    fields: initialForm ? formSchemaToBuilderFields(initialForm.schema) : [],
  }));
  const [selectedId, setSelectedId] = useState<string | null>(() => values.fields[0]?.builderId ?? null);
  const [tab, setTab] = useState<'design' | 'preview'>('design');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const selectedField = values.fields.find((field) => field.builderId === selectedId);
  const keyCounts = useMemo(() => {
    const map = new Map<string, number>();
    values.fields.forEach((field) => map.set(field.key, (map.get(field.key) ?? 0) + 1));
    return map;
  }, [values.fields]);

  const updateFields = (fields: BuilderField[]) => {
    setValues((current) => ({ ...current, fields: normalizeOrders(fields) }));
  };

  const addField = (type: FieldType) => {
    const next = createField(type, values.fields);
    updateFields([...values.fields, next]);
    setSelectedId(next.builderId);
    setTab('design');
  };

  const updateField = (updated: BuilderField) => {
    updateFields(values.fields.map((field) => field.builderId === updated.builderId ? updated : field));
  };

  const deleteField = (builderId: string) => {
    const index = values.fields.findIndex((field) => field.builderId === builderId);
    const next = values.fields.filter((field) => field.builderId !== builderId);
    updateFields(next);
    if (selectedId === builderId) {
      setSelectedId(next[Math.min(index, next.length - 1)]?.builderId ?? null);
    }
  };

  const duplicateField = (field: BuilderField) => {
    const usedKeys = new Set(values.fields.map((item) => item.key));
    let copyKey = `${field.key}Copy`;
    let copySuffix = 2;
    while (usedKeys.has(copyKey)) {
      copyKey = `${field.key}Copy${copySuffix}`;
      copySuffix += 1;
    }

    const copy: BuilderField = {
      ...field,
      builderId: crypto.randomUUID(),
      key: copyKey,
      label: `${field.label} (کپی)`,
      options: field.options.map((option) => ({ ...option })),
      validation: field.validation ? { ...field.validation } : null,
    };
    const index = values.fields.findIndex((item) => item.builderId === field.builderId);
    const next = [...values.fields];
    next.splice(index + 1, 0, copy);
    updateFields(next);
    setSelectedId(copy.builderId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = values.fields.findIndex((field) => field.builderId === active.id);
    const newIndex = values.fields.findIndex((field) => field.builderId === over.id);
    updateFields(arrayMove(values.fields, oldIndex, newIndex));
  };

  const save = async () => {
    const errors = validateDraft(values);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    await onSave({
      name: values.name.trim(),
      description: values.description.trim() || null,
      startAt: localInputToIso(values.startAt),
      endAt: localInputToIso(values.endAt),
      schema: builderFieldsToSchema(values.fields),
    });
  };

  const previewSchema = builderFieldsToSchema(values.fields);

  return (
    <Stack spacing={3}>
      {initialForm && initialForm.status !== 'DRAFT' && (
        <Alert severity="warning">فقط فرم DRAFT قابل ویرایش است.</Alert>
      )}
      {apiError && <Alert severity="error">{apiError}</Alert>}
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <Stack component="ul" sx={{ m: 0, pr: 2 }}>
            {validationErrors.map((error) => <li key={error}>{error}</li>)}
          </Stack>
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={800}>مشخصات فرم</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="نام فرم"
                value={values.name}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="توضیحات"
                value={values.description}
                onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                type="datetime-local"
                label="شروع پذیرش"
                value={values.startAt}
                onChange={(event) => setValues((current) => ({ ...current, startAt: event.target.value }))}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                label="پایان پذیرش"
                value={values.endAt}
                onChange={(event) => setValues((current) => ({ ...current, endAt: event.target.value }))}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab value="design" label="طراحی فرم" icon={<AddIcon />} iconPosition="start" />
          <Tab value="preview" label="پیش‌نمایش" icon={<PreviewIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {tab === 'design' ? (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: 2.5 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
              <FormFieldToolbox onAdd={addField} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 5.5 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <div>
                    <Typography variant="h6" fontWeight={800}>فرم</Typography>
                    <Typography variant="body2" color="text.secondary">
                      برای مرتب‌سازی، فیلدها را با دستگیره جابه‌جا کن.
                    </Typography>
                  </div>
                  <Divider />
                  {values.fields.length === 0 ? (
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        py: 8,
                        textAlign: 'center',
                      }}
                    >
                      <Typography color="text.secondary">از ستون فیلدها یک مورد اضافه کن.</Typography>
                    </Box>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={values.fields.map((field) => field.builderId)}
                        strategy={verticalListSortingStrategy}
                      >
                        <Stack spacing={1.5}>
                          {values.fields.map((field) => (
                            <SortableFieldCard
                              key={field.builderId}
                              field={field}
                              selected={field.builderId === selectedId}
                              onSelect={() => setSelectedId(field.builderId)}
                              onDuplicate={() => duplicateField(field)}
                              onDelete={() => deleteField(field.builderId)}
                            />
                          ))}
                        </Stack>
                      </SortableContext>
                    </DndContext>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
              <FieldSettingsPanel
                field={selectedField}
                keyError={selectedField && (
                  !/^[A-Za-z][A-Za-z0-9_]*$/.test(selectedField.key)
                    ? 'فرمت کلید معتبر نیست.'
                    : (keyCounts.get(selectedField.key) ?? 0) > 1
                      ? 'این کلید تکراری است.'
                      : null
                )}
                onChange={updateField}
              />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <div>
                <Typography variant="h5" fontWeight={800}>{values.name || 'فرم بدون نام'}</Typography>
                {values.description && <Typography color="text.secondary">{values.description}</Typography>}
              </div>
              <Divider />
              {values.fields.length === 0 ? (
                <Alert severity="info">هنوز فیلدی برای پیش‌نمایش وجود ندارد.</Alert>
              ) : (
                <DynamicFormRenderer
                  schema={previewSchema}
                  disabled
                  onSubmit={() => undefined}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={() => void save()}
          disabled={saving || (initialForm !== undefined && initialForm.status !== 'DRAFT')}
        >
          {saving ? 'در حال ذخیره...' : initialForm ? 'ذخیره نسخه جدید' : 'ایجاد فرم'}
        </Button>
      </Stack>
    </Stack>
  );
}
