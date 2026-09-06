export type UserRole = 'ADMIN' | 'USER';

export interface UserSummary {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'DRAWN' | 'ARCHIVED';

export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'PHONE'
  | 'DATE'
  | 'DATETIME'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'BOOLEAN';

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  key: string;
  type: FieldType;
  label: string;
  required: boolean;
  order: number;
  validation?: FieldValidation | null;
  options: FieldOption[];
}

export interface FormSchema {
  fields: FieldDefinition[];
}

export interface FormListItem {
  id: number;
  name: string;
  description?: string | null;
  status: FormStatus;
  currentVersion: number;
  startAt?: string | null;
  endAt?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface SaveFormRequest {
  name: string;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  schema: FormSchema;
}

export interface FormDetail {
  id: number;
  name: string;
  description?: string | null;
  status: FormStatus;
  currentVersion: number;
  startAt?: string | null;
  endAt?: string | null;
  schema: FormSchema;
}

export interface SubmissionResponse {
  id: number;
  formId: number;
  formVersion: number;
  userId: number;
  status: 'SUBMITTED' | 'DISQUALIFIED' | 'CANCELLED';
  answers: Record<string, unknown>;
  submittedAt: string;
}

export interface MySubmission {
  id: number;
  formId: number;
  formName: string;
  formStatus: FormStatus;
  formVersion: number;
  status: string;
  answers: Record<string, unknown>;
  submittedAt: string;
}


export type LotteryStatus = 'READY' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';

export interface LotteryWinner {
  position: number;
  userId: number;
  submissionId: number;
  selectedAt: string;
}

export interface LotteryResponse {
  id: number;
  formId: number;
  status: LotteryStatus;
  winnerCount: number;
  participantCount: number;
  createdBy: number;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  winners: LotteryWinner[];
}

export interface PublicLotteryWinner {
  position: number;
  displayName: string;
  currentUser: boolean;
  selectedAt: string;
}

export interface PublicLotteryResult {
  id: number;
  formId: number;
  status: LotteryStatus;
  winnerCount: number;
  participantCount: number;
  completedAt?: string | null;
  winners: PublicLotteryWinner[];
}

export interface ProblemDetail {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Array<{ field?: string; code?: string; message?: string }>;
}

export interface AdminSubmissionUser {
  id: number;
  email: string;
  displayName: string;
}

export interface AdminSubmission {
  id: number;
  formId: number;
  formVersion: number;
  user: AdminSubmissionUser | null;
  status: 'SUBMITTED' | 'DISQUALIFIED' | 'CANCELLED';
  answers: Record<string, unknown>;
  submittedAt: string;
}

export interface AdminLotteryWinner {
  position: number;
  userId: number;
  email: string;
  displayName: string;
  submissionId: number;
  selectedAt: string;
}
