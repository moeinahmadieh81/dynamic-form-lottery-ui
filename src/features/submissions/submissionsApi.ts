import { http } from '../../api/http';
import type {
  AdminSubmission,
  MySubmission,
  PageResponse,
  SubmissionResponse,
} from '../../types/api';

export async function submitForm(
  formId: number,
  answers: Record<string, unknown>,
): Promise<SubmissionResponse> {
  const { data } = await http.post<SubmissionResponse>(`/forms/${formId}/submissions`, { answers });
  return data;
}

export async function listMySubmissions(page = 0, size = 20): Promise<PageResponse<MySubmission>> {
  const { data } = await http.get<PageResponse<MySubmission>>('/me/submissions', {
    params: { page, size },
  });
  return data;
}

export async function listAdminSubmissions(
  formId: number,
  page = 0,
  size = 10,
): Promise<PageResponse<AdminSubmission>> {
  const { data } = await http.get<PageResponse<AdminSubmission>>(`/forms/${formId}/submissions`, {
    params: { page, size, sort: 'submittedAt', direction: 'desc' },
  });
  return data;
}
