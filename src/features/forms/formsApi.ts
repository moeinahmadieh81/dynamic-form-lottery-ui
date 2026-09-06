import { http } from '../../api/http';
import type { FormDetail, FormListItem, PageResponse, SaveFormRequest } from '../../types/api';

export type { SaveFormRequest } from '../../types/api';

export async function listForms(page = 0, size = 20): Promise<PageResponse<FormListItem>> {
  const { data } = await http.get<PageResponse<FormListItem>>('/forms', {
    params: { page, size, sort: 'updatedAt', direction: 'desc' },
  });
  return data;
}

export async function getForm(id: number): Promise<FormDetail> {
  const { data } = await http.get<FormDetail>(`/forms/${id}`);
  return data;
}

export async function createForm(request: SaveFormRequest): Promise<FormDetail> {
  const { data } = await http.post<FormDetail>('/forms', request);
  return data;
}

export async function updateDraftForm(id: number, request: SaveFormRequest): Promise<FormDetail> {
  const { data } = await http.put<FormDetail>(`/forms/${id}`, request);
  return data;
}

export async function publishForm(id: number): Promise<FormDetail> {
  const { data } = await http.post<FormDetail>(`/forms/${id}/publish`);
  return data;
}

export async function closeForm(id: number): Promise<FormDetail> {
  const { data } = await http.post<FormDetail>(`/forms/${id}/close`);
  return data;
}
