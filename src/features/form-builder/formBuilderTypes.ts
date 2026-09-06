import type { FieldDefinition, FieldType, FormSchema } from '../../types/api';

export interface BuilderField extends FieldDefinition {
  builderId: string;
}

export interface FormDraftValues {
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  fields: BuilderField[];
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: 'متن کوتاه',
  TEXTAREA: 'متن بلند',
  NUMBER: 'عدد',
  EMAIL: 'ایمیل',
  PHONE: 'شماره تماس',
  DATE: 'تاریخ',
  DATETIME: 'تاریخ و زمان',
  SELECT: 'لیست انتخابی',
  MULTI_SELECT: 'انتخاب چندگانه',
  RADIO: 'گزینه رادیویی',
  CHECKBOX: 'چک‌باکس چندگانه',
  BOOLEAN: 'بله / خیر',
};

export const OPTION_FIELD_TYPES: FieldType[] = ['SELECT', 'MULTI_SELECT', 'RADIO', 'CHECKBOX'];
export const TEXT_VALIDATION_FIELD_TYPES: FieldType[] = ['TEXT', 'TEXTAREA', 'EMAIL', 'PHONE'];

export function requiresOptions(type: FieldType) {
  return OPTION_FIELD_TYPES.includes(type);
}

export function builderFieldsToSchema(fields: BuilderField[]): FormSchema {
  return {
    fields: fields.map(({ builderId: _builderId, ...field }, index) => ({
      ...field,
      order: index + 1,
      options: field.options ?? [],
      validation: field.validation ?? null,
    })),
  };
}

export function formSchemaToBuilderFields(schema: FormSchema): BuilderField[] {
  return [...schema.fields]
    .sort((a, b) => a.order - b.order)
    .map((field, index) => ({
      ...field,
      builderId: crypto.randomUUID(),
      order: index + 1,
      options: field.options ?? [],
    }));
}
