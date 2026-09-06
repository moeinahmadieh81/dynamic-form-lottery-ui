import axios from 'axios';
import type { ProblemDetail } from '../types/api';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ProblemDetail>(error)) {
    const data = error.response?.data;
    if (data?.errors?.length) {
      return data.errors.map((item) => item.message ?? item.code).join('، ');
    }
    return data?.detail ?? data?.title ?? error.message;
  }
  return error instanceof Error ? error.message : 'خطای ناشناخته رخ داد.';
}
